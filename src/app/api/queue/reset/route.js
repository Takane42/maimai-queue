import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
  try {
    // Archive current queue data to history before reset
    const currentQueueItems = db.prepare(`
      SELECT * FROM queue 
      WHERE status = 'waiting' OR status = 'processing'
    `).all();    // Mark any active queue items as cancelled before reset
    if (currentQueueItems.length > 0) {
      const resetDate = new Date().toISOString();
      const cancelStmt = db.prepare(`
        UPDATE queue 
        SET status = 'cancelled', cancelledAt = ?, resetDate = ?
        WHERE status IN ('waiting', 'processing')
      `);
      cancelStmt.run(resetDate, resetDate);
    }

    // Reset the current number back to 1
    const resetNumberStmt = db.prepare(`
      UPDATE settings 
      SET value = '1' 
      WHERE key = 'currentNumber'
    `);
    resetNumberStmt.run();

    // Optionally, you could also delete old history records older than a certain date
    // Uncomment the following lines if you want to clean up very old history
    /*
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const deleteOldStmt = db.prepare(`
      DELETE FROM queue 
      WHERE status IN ('completed', 'cancelled') 
      AND (completedAt < ? OR cancelledAt < ?)
    `);
    deleteOldStmt.run(thirtyDaysAgo.toISOString(), thirtyDaysAgo.toISOString());
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Database reset successfully',
      cancelledItems: currentQueueItems.length
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}

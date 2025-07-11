import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// POST handler to complete all queue items at end of day
export async function POST() {
  try {
    const currentDate = new Date().toISOString();
    
    // Get all active queue items (waiting or processing)
    const activeItems = db.prepare(`
      SELECT id FROM queue 
      WHERE status IN ('waiting', 'processing')
    `).all();
    
    if (activeItems.length === 0) {
      return NextResponse.json({ 
        message: 'No active queue items to complete',
        completed: 0 
      });
    }
    
    // Mark all active items as completed
    const result = db.prepare(`
      UPDATE queue 
      SET status = 'completed', completedAt = ? 
      WHERE status IN ('waiting', 'processing')
    `).run(currentDate);
    
    console.log(`Daily cron job: Completed ${result.changes} queue items at ${currentDate}`);
    
    return NextResponse.json({ 
      message: `Successfully completed ${result.changes} queue items`,
      completed: result.changes,
      timestamp: currentDate
    });
  } catch (error) {
    console.error('Error in daily queue completion cron job:', error);
    return NextResponse.json(
      { error: 'Failed to complete daily queue items' },
      { status: 500 }
    );
  }
}

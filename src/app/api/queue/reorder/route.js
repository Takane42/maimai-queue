import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// PUT handler to reorder queue positions
export async function PUT(request) {
  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      );
    }
    
    // Begin a transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Update each item's position (only for non-AFK items)
      for (let i = 0; i < items.length; i++) {
        db.prepare(`
          UPDATE queue 
          SET position = ? 
          WHERE id = ? AND status IN ('waiting', 'processing')
        `).run(i + 1, items[i].id);
      }
      
      // Commit the transaction
      db.prepare('COMMIT').run();
      
      // Get the updated queue with AFK items at the bottom
      const updatedQueue = db.prepare(`
        SELECT * FROM queue 
        WHERE status IN ('waiting', 'processing', 'afk') 
        ORDER BY 
          CASE 
            WHEN status = 'afk' THEN 1 
            ELSE 0 
          END ASC,
          position ASC
      `).all();
      
      return NextResponse.json(updatedQueue);
    } catch (error) {
      // Rollback on error
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error reordering queue:', error);
    return NextResponse.json(
      { error: 'Failed to reorder queue' },
      { status: 500 }
    );
  }
}

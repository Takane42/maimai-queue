import db from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET handler to fetch all queue items
export async function GET() {
  try {
    // Get all active queue items ordered by position, with AFK items at the bottom
    const queue = db.prepare(`
      SELECT * FROM queue 
      WHERE status IN ('waiting', 'processing', 'afk') 
      ORDER BY 
        CASE 
          WHEN status = 'afk' THEN 2 
          ELSE 1 
        END ASC,
        position ASC
    `).all();
    
    // Get current number
    const currentNumberRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('currentNumber');
    const currentNumber = currentNumberRow ? parseInt(currentNumberRow.value) : 1;
    
    return NextResponse.json({ queue, currentNumber });
  } catch (error) {
    console.error('Error fetching queue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue data' },
      { status: 500 }
    );
  }
}

// POST handler to add a new queue item
export async function POST(request) {
  try {
    const { name1, name2, notes } = await request.json();
    
    if (!name1) {
      return NextResponse.json(
        { error: 'At least one name is required' },
        { status: 400 }
      );
    }
    
    // Get current number and increment it
    const currentNumberRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('currentNumber');
    const currentNumber = currentNumberRow ? parseInt(currentNumberRow.value) : 1;
    const nextNumber = currentNumber + 1;
    
    // Get the highest position value from non-AFK items
    const maxPositionRow = db.prepare(`
      SELECT MAX(position) as maxPosition FROM queue WHERE status IN ('waiting', 'processing')
    `).get();
    const position = maxPositionRow.maxPosition ? maxPositionRow.maxPosition + 1 : 1;
    
    // If there are AFK items, we need to shift their positions down
    const afkItems = db.prepare(`
      SELECT id FROM queue WHERE status = 'afk' ORDER BY position ASC
    `).all();
    
    if (afkItems.length > 0) {
      // Shift AFK items down by one position
      for (let i = 0; i < afkItems.length; i++) {
        db.prepare(`
          UPDATE queue SET position = ? WHERE id = ?
        `).run(position + i + 1, afkItems[i].id);
      }
    }
    
    // Insert the new queue item
    const result = db.prepare(`
      INSERT INTO queue (number, name1, name2, notes, status, position, joinedAt)
      VALUES (?, ?, ?, ?, 'waiting', ?, ?)
    `).run(currentNumber, name1, name2 || null, notes || null, position, new Date().toISOString());
    
    // Update the current number
    db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(nextNumber.toString(), 'currentNumber');
    
    // Get the inserted item
    const newQueueItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json(newQueueItem);
  } catch (error) {
    console.error('Error adding to queue:', error);
    return NextResponse.json(
      { error: 'Failed to add to queue' },
      { status: 500 }
    );
  }
}

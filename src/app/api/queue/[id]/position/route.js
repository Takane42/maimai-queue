import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// PUT handler to update a queue item's position (for drag-and-drop)
export async function PUT(request, { params }) {
  try {
    // Properly handle params without destructuring
    const id = params.id;
    const { newPosition } = await request.json();
    
    // Get the current position of the item
    const item = db.prepare('SELECT position FROM queue WHERE id = ?').get(id);
    if (!item) {
      return NextResponse.json({ error: 'Queue item not found' }, { status: 404 });
    }

    const oldPosition = item.position;
    
    // Update positions of affected items in a transaction
    db.transaction(() => {
      if (newPosition > oldPosition) {
        // Moving down: decrease position of items between old and new positions
        db.prepare(`
          UPDATE queue
          SET position = position - 1
          WHERE position > ? AND position <= ? AND status IN ('waiting', 'processing')
        `).run(oldPosition, newPosition);
      } else if (newPosition < oldPosition) {
        // Moving up: increase position of items between new and old positions
        db.prepare(`
          UPDATE queue
          SET position = position + 1
          WHERE position >= ? AND position < ? AND status IN ('waiting', 'processing')
        `).run(newPosition, oldPosition);
      }
      
      // Update position of the dragged item
      db.prepare('UPDATE queue SET position = ? WHERE id = ?').run(newPosition, id);
    })();
    
    // Get the updated item
    const updatedItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(id);
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating queue position:', error);
    return NextResponse.json(
      { error: 'Failed to update queue position' },
      { status: 500 }
    );
  }
}

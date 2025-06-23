import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// GET a specific queue item
export async function GET(request, { params }) {
  try {
    // Properly await the params
    const id = params.id;
    const queueItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(id);
    
    if (!queueItem) {
      return NextResponse.json(
        { error: 'Queue item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(queueItem);
  } catch (error) {
    console.error('Error fetching queue item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue item' },
      { status: 500 }
    );
  }
}

// PUT handler to update a queue item's status, details, or position
export async function PUT(request, { params }) {
  try {
    // Properly handle params without destructuring
    const id = params.id;
    const { status, position, name1, name2, notes } = await request.json();
    
    const queueItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(id);
    
    if (!queueItem) {
      return NextResponse.json(
        { error: 'Queue item not found' },
        { status: 404 }
      );
    }
    
    // Update names and notes if provided
    if (name1 !== undefined || name2 !== undefined || notes !== undefined) {
      const updateFields = [];
      const updateValues = [];
      
      if (name1 !== undefined) {
        updateFields.push('name1 = ?');
        updateValues.push(name1);
      }
      
      if (name2 !== undefined) {
        updateFields.push('name2 = ?');
        updateValues.push(name2);
      }
      
      if (notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(notes);
      }
      
      if (updateFields.length > 0) {
        db.prepare(`
          UPDATE queue 
          SET ${updateFields.join(', ')}
          WHERE id = ?
        `).run(...updateValues, id);
      }
    }
    
    // Update based on the requested status change
    if (status === 'processing' && queueItem.status === 'waiting') {
      // Start processing
      db.prepare(`
        UPDATE queue 
        SET status = 'processing', processingStartedAt = ? 
        WHERE id = ?
      `).run(new Date().toISOString(), id);
    } 
    else if (status === 'completed' && queueItem.status === 'processing') {
      // Complete processing
      db.prepare(`
        UPDATE queue 
        SET status = 'completed', completedAt = ? 
        WHERE id = ?
      `).run(new Date().toISOString(), id);
    } 
    else if (status === 'cancelled') {
      // Cancel queue item
      db.prepare(`
        UPDATE queue 
        SET status = 'cancelled', cancelledAt = ? 
        WHERE id = ?
      `).run(new Date().toISOString(), id);
    }
    
    // Update position if provided (for drag and drop)
    if (position !== undefined) {
      db.prepare('UPDATE queue SET position = ? WHERE id = ?').run(position, id);
      
      // Reorder other items if needed
      // This is a simple approach - more complex reordering might be needed depending on requirements
      if (queueItem.position !== position) {
        if (position > queueItem.position) {
          // Moving down - shift items up
          db.prepare(`
            UPDATE queue 
            SET position = position - 1 
            WHERE position > ? AND position <= ? AND id != ? AND status IN ('waiting', 'processing')
          `).run(queueItem.position, position, id);
        } else {
          // Moving up - shift items down
          db.prepare(`
            UPDATE queue 
            SET position = position + 1 
            WHERE position >= ? AND position < ? AND id != ? AND status IN ('waiting', 'processing')
          `).run(position, queueItem.position, id);
        }
      }
    }
    
    // Get the updated item
    const updatedQueueItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(id);
    return NextResponse.json(updatedQueueItem);
  } catch (error) {
    console.error('Error updating queue item:', error);
    return NextResponse.json(
      { error: 'Failed to update queue item' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a queue item
export async function DELETE(request, { params }) {
  try {
    // Properly handle params
    const id = params.id;
    
    const queueItem = db.prepare('SELECT * FROM queue WHERE id = ?').get(id);
    
    if (!queueItem) {
      return NextResponse.json(
        { error: 'Queue item not found' },
        { status: 404 }
      );
    }
    
    // Delete the queue item
    db.prepare('DELETE FROM queue WHERE id = ?').run(id);
    
    // Reorder remaining items
    db.prepare(`
      UPDATE queue 
      SET position = position - 1 
      WHERE position > ? AND status IN ('waiting', 'processing')
    `).run(queueItem.position);
    
    return NextResponse.json({ message: 'Queue item deleted' });
  } catch (error) {
    console.error('Error deleting queue item:', error);
    return NextResponse.json(
      { error: 'Failed to delete queue item' },
      { status: 500 }
    );
  }
}

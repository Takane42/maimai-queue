import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// GET handler to fetch queue statistics
export async function GET() {
  try {
    // Get today's date range (from start of day to end of day)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    
    // Get all waiting queue entries today
    const waitingEntries = db.prepare(`
      SELECT name1, name2 
      FROM queue 
      WHERE status = 'waiting' 
        AND joinedAt >= ? 
        AND joinedAt < ?
    `).all(startOfDay, endOfDay);
    
    // Get all processing queue entries today
    const processingEntries = db.prepare(`
      SELECT name1, name2 
      FROM queue 
      WHERE status = 'processing' 
        AND joinedAt >= ? 
        AND joinedAt < ?
    `).all(startOfDay, endOfDay);
    
    // Count unique players from both name1 and name2 fields
    const waitingPlayers = new Set();
    waitingEntries.forEach(entry => {
      waitingPlayers.add(entry.name1);
      if (entry.name2) {
        waitingPlayers.add(entry.name2);
      }
    });
    
    const processingPlayers = new Set();
    processingEntries.forEach(entry => {
      processingPlayers.add(entry.name1);
      if (entry.name2) {
        processingPlayers.add(entry.name2);
      }
    });
        
    return NextResponse.json({
      waiting: waitingPlayers.size,
      processing: processingPlayers.size,
    });
  } catch (error) {
    console.error('Error fetching queue statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue statistics' },
      { status: 500 }
    );
  }
}

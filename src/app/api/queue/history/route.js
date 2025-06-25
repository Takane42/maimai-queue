import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT * FROM queue 
      WHERE status IN ('completed', 'cancelled')
      ORDER BY 
        CASE 
          WHEN completedAt IS NOT NULL THEN completedAt
          WHEN cancelledAt IS NOT NULL THEN cancelledAt
          ELSE joinedAt
        END DESC
    `);
    
    const history = stmt.all();
    
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

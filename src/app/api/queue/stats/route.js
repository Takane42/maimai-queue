import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// GET handler to fetch queue statistics
export async function GET() {
  try {
    // Count waiting items
    const waitingCount = db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'waiting'").get().count;
    
    // Count processing items
    const processingCount = db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'processing'").get().count;
        
    return NextResponse.json({
      waiting: waitingCount,
      processing: processingCount,
    });
  } catch (error) {
    console.error('Error fetching queue statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue statistics' },
      { status: 500 }
    );
  }
}

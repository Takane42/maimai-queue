import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

// POST handler to complete all queue items at end of day
export async function POST() {
  try {
    const currentDate = new Date().toISOString();
    
    // Check AFK exclusion setting
    let excludeAfk = false;
    try {
      const afkResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cron/afk-exclusion`);
      if (afkResponse.ok) {
        const afkData = await afkResponse.json();
        excludeAfk = afkData.excludeAfkFromCompletion;
      }
    } catch (error) {
      console.log('Could not fetch AFK exclusion setting, defaulting to include AFK players');
    }
    
    // Build the query based on AFK exclusion setting
    const statusCondition = excludeAfk 
      ? "status IN ('waiting', 'processing')" 
      : "status IN ('waiting', 'processing', 'afk')";
    
    // Get all active queue items (based on exclusion setting)
    const activeItems = db.prepare(`
      SELECT id, status FROM queue 
      WHERE ${statusCondition}
    `).all();
    
    if (activeItems.length === 0) {
      return NextResponse.json({ 
        message: 'No active queue items to complete',
        completed: 0,
        afkExcluded: excludeAfk,
        excludedAfkCount: excludeAfk ? db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'afk'").get().count : 0
      });
    }
    
    // Mark all active items as completed (based on exclusion setting)
    const result = db.prepare(`
      UPDATE queue 
      SET status = 'completed', completedAt = ? 
      WHERE ${statusCondition}
    `).run(currentDate);
    
    // Get count of excluded AFK items if applicable
    const excludedAfkCount = excludeAfk ? db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'afk'").get().count : 0;
    
    console.log(`Daily cron job: Completed ${result.changes} queue items at ${currentDate}${excludeAfk ? ` (excluded ${excludedAfkCount} AFK players)` : ''}`);
    
    return NextResponse.json({ 
      message: `Successfully completed ${result.changes} queue items${excludeAfk ? ` (excluded ${excludedAfkCount} AFK players)` : ''}`,
      completed: result.changes,
      afkExcluded: excludeAfk,
      excludedAfkCount: excludedAfkCount,
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

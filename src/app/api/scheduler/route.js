import { NextResponse } from 'next/server';
import { enableScheduler, disableScheduler, getSchedulerStatus } from '../../../lib/scheduler';

// Global variable to track scheduler state
let schedulerState = {
  isEnabled: true,
  lastToggleTime: null
};

// GET endpoint to check scheduler status
export async function GET() {
  try {
    const status = getSchedulerStatus();
    return NextResponse.json({
      isEnabled: schedulerState.isEnabled,
      lastToggleTime: schedulerState.lastToggleTime,
      status: schedulerState.isEnabled ? 'active' : 'disabled',
      schedulerInfo: status
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduler status' },
      { status: 500 }
    );
  }
}

// POST endpoint to enable/disable scheduler
export async function POST(request) {
  try {
    const { action } = await request.json();
    
    if (!['enable', 'disable'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "enable" or "disable"' },
        { status: 400 }
      );
    }
    
    const wasEnabled = schedulerState.isEnabled;
    schedulerState.isEnabled = action === 'enable';
    schedulerState.lastToggleTime = new Date().toISOString();
    
    // Actually enable/disable the scheduler
    if (action === 'enable') {
      enableScheduler();
    } else {
      disableScheduler();
    }
    
    return NextResponse.json({
      success: true,
      action: action,
      previousState: wasEnabled ? 'enabled' : 'disabled',
      currentState: schedulerState.isEnabled ? 'enabled' : 'disabled',
      timestamp: schedulerState.lastToggleTime,
      message: `Scheduler ${action}d successfully`
    });
  } catch (error) {
    console.error('Error toggling scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to toggle scheduler' },
      { status: 500 }
    );
  }
}

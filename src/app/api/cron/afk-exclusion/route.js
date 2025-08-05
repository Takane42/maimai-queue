import { NextResponse } from 'next/server';

// Global variable to track AFK exclusion setting
let afkExclusionState = {
  excludeAfkFromCompletion: false,
  lastToggleTime: null
};

// GET endpoint to check AFK exclusion status
export async function GET() {
  try {
    return NextResponse.json({
      excludeAfkFromCompletion: afkExclusionState.excludeAfkFromCompletion,
      lastToggleTime: afkExclusionState.lastToggleTime,
      status: afkExclusionState.excludeAfkFromCompletion ? 'AFK players excluded' : 'AFK players included'
    });
  } catch (error) {
    console.error('Error getting AFK exclusion status:', error);
    return NextResponse.json(
      { error: 'Failed to get AFK exclusion status' },
      { status: 500 }
    );
  }
}

// POST endpoint to toggle AFK exclusion
export async function POST(request) {
  try {
    const { excludeAfkFromCompletion } = await request.json();
    
    if (typeof excludeAfkFromCompletion !== 'boolean') {
      return NextResponse.json(
        { error: 'excludeAfkFromCompletion must be a boolean value' },
        { status: 400 }
      );
    }
    
    const wasExcluding = afkExclusionState.excludeAfkFromCompletion;
    afkExclusionState.excludeAfkFromCompletion = excludeAfkFromCompletion;
    afkExclusionState.lastToggleTime = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      excludeAfkFromCompletion: afkExclusionState.excludeAfkFromCompletion,
      previousState: wasExcluding ? 'excluded' : 'included',
      currentState: afkExclusionState.excludeAfkFromCompletion ? 'excluded' : 'included',
      timestamp: afkExclusionState.lastToggleTime,
      message: `AFK players will now be ${afkExclusionState.excludeAfkFromCompletion ? 'excluded from' : 'included in'} daily completion`
    });
  } catch (error) {
    console.error('Error toggling AFK exclusion:', error);
    return NextResponse.json(
      { error: 'Failed to toggle AFK exclusion setting' },
      { status: 500 }
    );
  }
}

// Export the state getter for use in other API routes
export function getAfkExclusionState() {
  return afkExclusionState.excludeAfkFromCompletion;
}

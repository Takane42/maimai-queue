import { NextResponse } from 'next/server';
import { scheduleResetWithInterval } from '@/lib/scheduler';

let schedulerInitialized = false;

export async function POST() {
  try {
    if (!schedulerInitialized) {
      scheduleResetWithInterval();
      schedulerInitialized = true;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scheduler initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to initialize scheduler' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const timezone = process.env.TIMEZONE || 'Asia/Jakarta';
    const now = new Date();
    const localTime = now.toLocaleString('en-US', { timeZone: timezone });
    const localTimeDetailed = now.toLocaleString('en-US', { 
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    return NextResponse.json({
      message: 'Cron job debug information',
      serverTime: now.toISOString(),
      timezone: timezone,
      localTime: localTime,
      localTimeDetailed: localTimeDetailed,
      nextCronAt: '22:00 (10:00 PM)',
      environment: process.env.NODE_ENV,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      currentHour: now.getHours(),
      currentMinute: now.getMinutes()
    });
  } catch (error) {
    console.error('Error in cron debug:', error);
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log('Manual cron trigger called');
    
    // Call the daily completion endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/cron/complete-daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        message: 'Manual cron job triggered successfully',
        result: result
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to trigger cron job', status: response.status },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in manual cron trigger:', error);
    return NextResponse.json(
      { error: 'Failed to trigger cron job manually' },
      { status: 500 }
    );
  }
}

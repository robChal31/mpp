// app/api/mpartner/pk/renewal/route.ts
import { getCurrentUser } from '@/lib/auth';
import { renewProgram } from '@/server/services/mpartner/pk.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pk_id } = body;

    if (!pk_id) {
      return NextResponse.json({
        status: 'error',
        message: 'pk_id is required'
      }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    if (!user?.email) {
      return NextResponse.json({
        status: 'error',
        message: 'User not authenticated'
      }, { status: 401 });
    }

    const result = await renewProgram({
      email: user.email,
      pk_id: pk_id
    });

    if (!result || !result.success) {
      return NextResponse.json({
        status: 'error',
        message: result?.message || 'Failed to renew program'
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: result.message || 'Program renewed successfully'
    });

  } catch (error) {
    console.error('Error renewing program:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to renew program'
    }, { status: 500 });
  }
}
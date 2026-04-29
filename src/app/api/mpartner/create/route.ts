import { createService } from '@/server/services/mpartner/create.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { status: 'error', message: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validasi email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await createService({ email, name });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle error dari service
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 409 } // Conflict
      );
    }
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
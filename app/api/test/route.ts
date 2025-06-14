import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        return NextResponse.json({ message: "SUCCESS!" });
    } catch (error) {
        console.error('Error processing request:', error);

        return NextResponse.json(
            { error: 'Failed to generate wishes' },
            { status: 500 }
        );
    }
}

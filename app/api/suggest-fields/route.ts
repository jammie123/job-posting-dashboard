import { NextResponse } from 'next/server';

// OpenAI suggestions are disabled so static Netlify builds
// do not require OPENAI_API_KEY at compile time.
export async function POST() {
  return NextResponse.json(
    { error: 'OpenAI suggestions are disabled in this prototype.' },
    { status: 501 }
  );
}

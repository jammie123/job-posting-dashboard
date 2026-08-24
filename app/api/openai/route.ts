import { NextResponse } from 'next/server';

// OpenAI proxy is disabled so static Netlify builds
// do not require OPENAI_API_KEY at compile time.
export async function POST() {
  return NextResponse.json(
    { error: 'OpenAI is disabled in this prototype.' },
    { status: 501 }
  );
}

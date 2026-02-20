import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Attempt to fetch transcript
        const transcriptArray = await YoutubeTranscript.fetchTranscript(url);
        if (!transcriptArray || transcriptArray.length === 0) {
            return NextResponse.json({ error: 'No captions found or blocked' }, { status: 403 });
        }

        const text = transcriptArray.map(t => t.text).join(' ');
        return NextResponse.json({ transcript: text });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

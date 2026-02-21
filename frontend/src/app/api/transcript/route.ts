import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function parseVtt(vtt: string): string {
    const lines = vtt.split('\n');
    const textLines: string[] = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'WEBVTT' || trimmed.includes('-->') || /^\d+$/.test(trimmed)) continue;
        if (trimmed.startsWith('Kind:') || trimmed.startsWith('Language:') || trimmed.startsWith('NOTE')) continue;
        const clean = trimmed.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
        if (clean && (textLines.length === 0 || clean !== textLines[textLines.length - 1])) {
            textLines.push(clean);
        }
    }
    return textLines.join(' ');
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        const vidMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (!vidMatch) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        const videoId = vidMatch[1];

        // Fetch YouTube page to extract ytInitialPlayerResponse
        const ytRes = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const html = await ytRes.text();

        // Extract ytInitialPlayerResponse
        const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|window|<\/script)/);
        if (!match) {
            return NextResponse.json({ error: 'Could not parse YouTube page' }, { status: 500 });
        }

        const playerData = JSON.parse(match[1]);
        const captionTracks: any[] = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

        if (captionTracks.length === 0) {
            return NextResponse.json({ error: 'No captions available for this video' }, { status: 404 });
        }

        // Prefer english tracks
        const track = captionTracks.find((t: any) => t.languageCode?.startsWith('en')) || captionTracks[0];
        const vttUrl = `${track.baseUrl}&fmt=vtt`;

        const vttRes = await fetch(vttUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
        });

        const vttText = await vttRes.text();

        if (!vttText || vttText.length < 50) {
            return NextResponse.json({ error: 'Captions returned empty content' }, { status: 403 });
        }

        const transcript = parseVtt(vttText);
        return NextResponse.json({ transcript, videoId, characterCount: transcript.length });

    } catch (error: any) {
        console.error('Transcript API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

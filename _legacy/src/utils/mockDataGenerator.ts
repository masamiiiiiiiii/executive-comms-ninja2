
export interface AnalysisFrame {
    timestamp: number;
    metrics: {
        confidence: number;
        enthusiasm: number;
        clarity: number;
        trust: number;
    };
    dominantEmotion: string;
    transcriptSegment?: string;
}

export const generateMockAnalysisData = (durationSeconds: number): AnalysisFrame[] => {
    const frames: AnalysisFrame[] = [];
    const frameRate = 1; // 1 frame per second for smoothness

    // Base values
    let confidence = 75;
    let enthusiasm = 70;
    let clarity = 80;
    let trust = 72;

    // Generate realistic fluctuations
    for (let t = 0; t <= durationSeconds; t += frameRate) {
        // Random walk with boundaries
        confidence = Math.max(50, Math.min(100, confidence + (Math.random() * 6 - 3)));
        enthusiasm = Math.max(40, Math.min(95, enthusiasm + (Math.random() * 8 - 4)));
        clarity = Math.max(60, Math.min(98, clarity + (Math.random() * 4 - 2)));
        trust = Math.max(55, Math.min(90, trust + (Math.random() * 5 - 2.5)));

        // Create interesting "events" every ~30 seconds
        if (t % 30 < 5) {
            confidence += 5; // Boost during "peaks"
            enthusiasm += 5;
        }

        frames.push({
            timestamp: t,
            metrics: {
                confidence: Math.round(confidence),
                enthusiasm: Math.round(enthusiasm),
                clarity: Math.round(clarity),
                trust: Math.round(trust)
            },
            dominantEmotion: deriveEmotion(confidence, enthusiasm),
            transcriptSegment: "Simulated speech analysis segment..."
        });
    }

    return frames;
};

const deriveEmotion = (confidence: number, enthusiasm: number): string => {
    if (confidence > 85 && enthusiasm > 80) return "Passionate & Authoritative";
    if (confidence > 80) return "Confident";
    if (enthusiasm > 85) return "Highly Enthusiastic";
    if (confidence < 60) return "Uncertain";
    return "Professional Neutral";
};

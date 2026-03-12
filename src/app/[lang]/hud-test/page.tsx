import { BiometricHUD, VocalHUD, SemanticHUD } from "@/components/v2/oblivion-hud-patterns";

export default function HUDTestPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-mono">
            <h1 className="text-3xl font-bold mb-2 text-cyan-400">HUD Pattern Prototypes</h1>
            <p className="text-slate-400 mb-12 max-w-2xl">
                Please review the following 3 patterns designed specifically for Interview & Communication Analysis.
                Instead of a weapon's targeting system, these are built around Observation, Listening, and Cognitive Processing.
            </p>

            <div className="flex flex-col gap-16">

                {/* Pattern 1 */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-cyan-300">Pattern 1: The Biometric Observer (Type: Optical / Focus)</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Inspired by Vika's drone surveillance and facial scanners. Focuses on physical micro-expressions,
                            pupil dilation, and facial symmetry. Uses a central camera-lens aesthetic rather than a radar.
                        </p>
                    </div>
                    <div className="w-full relative rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <BiometricHUD />
                    </div>
                </section>

                {/* Pattern 2 */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-sky-300">Pattern 2: The Vocal Intercept (Type: Audio / Horizontal)</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Inspired by horizontal communication arrays and oscilloscope data streams. Focuses entirely on the
                            speaker's voice, analyzing tonal stability, cadence shifts, and frequency bands.
                        </p>
                    </div>
                    <div className="w-full relative rounded-xl overflow-hidden border border-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                        <VocalHUD />
                    </div>
                </section>

                {/* Pattern 3 */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-teal-300">Pattern 3: The Semantic Matrix (Type: Cognitive / Data Grid)</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Inspired by DNA/deep-dive DNA scanners. Focuses on the logic, keywords, and cognitive conviction of the speech.
                            Utilizes a dense hexagonal/honeycomb structural layout.
                        </p>
                    </div>
                    <div className="w-full relative rounded-xl overflow-hidden border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                        <SemanticHUD />
                    </div>
                </section>

            </div>
        </div>
    );
}

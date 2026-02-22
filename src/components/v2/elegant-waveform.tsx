"use client";

import React, { useEffect, useRef } from "react";

export const ElegantWaveform: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        // Animation state variables for organic movement
        let time1 = 0;
        let time2 = 100; // offset the second line's phase

        let speedTarget = 0.015;
        let currentSpeed = 0.015;

        let ampTarget1 = 50;
        let currentAmp1 = 50;

        let ampTarget2 = 30;
        let currentAmp2 = 30;

        const points = 200; // Smooth curve resolution

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Refined rhythm (メリハリ): mostly calm, occasional quick swoops
            if (Math.random() < 0.01) {
                // Sudden speed/amplitude burst
                speedTarget = Math.random() * 0.08 + 0.04;
                ampTarget1 = Math.random() * 100 + 40;
                ampTarget2 = Math.random() * 80 + 20;
            } else if (Math.random() < 0.02) {
                // Return to calm, elegant floating
                speedTarget = 0.015;
                ampTarget1 = 40;
                ampTarget2 = 25;
            }

            // Smooth interpolation toward targets (easing creates the organic feel)
            currentSpeed += (speedTarget - currentSpeed) * 0.02;
            currentAmp1 += (ampTarget1 - currentAmp1) * 0.03;
            currentAmp2 += (ampTarget2 - currentAmp2) * 0.03;

            time1 += currentSpeed;
            time2 += currentSpeed * 0.7; // Second line moves slightly differently

            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;
            const slice = width / (points - 1);

            // Set global canvas blend and glow
            ctx.globalCompositeOperation = "screen";

            // Draw Line 1 (Core Wave - Thicker, Brighter)
            ctx.beginPath();
            ctx.strokeStyle = "rgba(16, 185, 129, 0.9)"; // Bright Emerald
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(52, 211, 153, 0.8)";

            let x = 0;
            for (let i = 0; i < points; i++) {
                // Organic compound wave (using 3 overlapping sines for complexity)
                const wave1 = Math.sin(i * 0.04 + time1);
                const wave2 = Math.cos(i * 0.015 - time1 * 0.8);
                const wave3 = Math.sin(i * 0.08 + time1 * 1.5);

                // Taper edges to 0 so it connects smoothly to the sides
                const envelope = Math.sin((i / (points - 1)) * Math.PI);

                // Combine waves and apply envelope and amplitude
                const y = centerY + (wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1) * currentAmp1 * envelope;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += slice;
            }
            ctx.stroke();

            // Draw Line 2 (Secondary Wave - Thinner, Softer, Contrasting Phase)
            ctx.beginPath();
            ctx.strokeStyle = "rgba(52, 211, 153, 0.5)"; // Softer Mint
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(16, 185, 129, 0.4)";

            x = 0;
            for (let i = 0; i < points; i++) {
                const wave1 = Math.sin(i * 0.06 + time2);
                const wave2 = Math.sin(i * 0.02 + time2 * 0.4);
                const wave3 = Math.cos(i * 0.05 - time2 * 1.2);
                const envelope = Math.sin((i / (points - 1)) * Math.PI);

                // Add slight offset based on wave3 so it separates from Line 1 nicely
                const offset = wave3 * 10;
                const y = centerY + (wave1 * 0.5 + wave2 * 0.5) * currentAmp2 * envelope + offset;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += slice;
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center w-full h-full mix-blend-screen opacity-80">
            {/* Soft, pulsating glowing aura behind the waveforms */}
            <div className="absolute w-[80%] h-[60%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pb-8"
            />
        </div>
    );
};

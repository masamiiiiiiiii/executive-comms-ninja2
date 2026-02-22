"use client";

import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * Liquid Metal Ambient Background
 * 
 * Uses SVG metaball filter (feGaussianBlur + feColorMatrix threshold)
 * combined with morphing SVG paths to create a liquid-metal effect
 * where shapes split apart and merge back together in a seamless loop.
 */
export const AmbientLiquidBackground: React.FC = () => {
    const uid = useId().replace(/:/g, '');
    const filterId = `metaball-${uid}`;
    const turbId = `turb-${uid}`;
    const dispId = `disp-${uid}`;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* SVG Definitions: Metaball filter + Displacement for organic distortion */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    {/* Metaball Gooey Filter: blurs shapes together then applies a sharp alpha threshold */}
                    <filter id={filterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
                            result="goo"
                        />
                        {/* Subtle displacement for organic ripple */}
                        <feTurbulence
                            id={turbId}
                            type="fractalNoise"
                            baseFrequency="0.015"
                            numOctaves="2"
                            seed="3"
                            result="noise"
                        >
                            <animate
                                attributeName="seed"
                                values="3;8;3"
                                dur="8s"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feDisplacementMap
                            id={dispId}
                            in="goo"
                            in2="noise"
                            scale="8"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* The metaball container: all children shapes merge/split via the filter */}
            <svg
                viewBox="0 0 320 600"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full opacity-30"
                style={{ filter: `url(#${filterId})` }}
            >
                {/* Main body - splits into two, then recombines */}
                <motion.ellipse
                    cx="160" cy="300"
                    fill="#34d399"
                    animate={{
                        rx: [50, 35, 70, 40, 50],
                        ry: [60, 80, 45, 70, 60],
                        cx: [160, 140, 180, 130, 160],
                        cy: [300, 250, 320, 280, 300],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Secondary blob: drifts away and merges back */}
                <motion.ellipse
                    cx="160" cy="300"
                    fill="#10b981"
                    animate={{
                        rx: [30, 45, 25, 50, 30],
                        ry: [35, 25, 55, 30, 35],
                        cx: [160, 210, 120, 200, 160],
                        cy: [300, 200, 380, 230, 300],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Small satellite: orbits and fuses */}
                <motion.circle
                    cx="160" cy="300" r="20"
                    fill="#6ee7b7"
                    animate={{
                        r: [20, 15, 28, 12, 20],
                        cx: [160, 220, 100, 190, 160],
                        cy: [300, 350, 240, 380, 300],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Tiny droplet: splits off and snaps back */}
                <motion.circle
                    cx="160" cy="260" r="10"
                    fill="#34d399"
                    animate={{
                        r: [10, 18, 8, 14, 10],
                        cx: [160, 100, 220, 140, 160],
                        cy: [260, 200, 350, 180, 260],
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Another droplet with offset timing */}
                <motion.circle
                    cx="180" cy="340" r="12"
                    fill="#10b981"
                    animate={{
                        r: [12, 8, 22, 10, 12],
                        cx: [180, 240, 130, 200, 180],
                        cy: [340, 400, 260, 360, 340],
                    }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>

            {/* Metallic highlight shimmer */}
            <motion.div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};

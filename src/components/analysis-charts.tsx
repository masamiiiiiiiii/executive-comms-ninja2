"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AnalysisChartsProps {
    data: Record<string, number>;
    benchmarkData?: Record<string, number>;
    isEliteBenchmark?: boolean;
}

export function AnalysisCharts({ data, benchmarkData, isEliteBenchmark = false }: AnalysisChartsProps) {
    if (!data) return <div className="text-sm text-muted-foreground">No metrics available.</div>;

    const subjects = Object.keys(data);
    const numPoints = subjects.length;

    // SVG coordinate system setup
    const size = 500;
    const center = size / 2;
    const radius = size * 0.26; // Much more room for outside text labels so they never clip

    // Precompute polygon points based on a 0-100 scale dataset
    const getPoints = (record: Record<string, number>) => {
        return subjects.map((subj, i) => {
            const val = record[subj] || 0;
            const r = (val / 100) * radius;
            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle)
            };
        });
    };

    const userPoints = useMemo(() => getPoints(data), [data, subjects]);
    const benchPoints = useMemo(() => benchmarkData ? getPoints(benchmarkData) : [], [benchmarkData, subjects]);

    // Format into SVG polygon strings
    const toPolygonStr = (pts: { x: number, y: number }[]) => pts.map(p => `${p.x},${p.y}`).join(" ");

    const userPolygon = toPolygonStr(userPoints);
    const benchPolygon = toPolygonStr(benchPoints);

    // Create concentric background grid lines
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
        <div className="relative w-full h-full flex items-center justify-center min-h-[300px]">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[500px] drop-shadow-sm">

                {/* 1. Radar Web Background (Animated drawing effect) */}
                <g className="stroke-slate-400" strokeWidth="1" fill="none">
                    {gridLevels.map((level, idx) => {
                        const r = radius * level;
                        const pts = subjects.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                        }).join(" ");
                        return (
                            <motion.polygon
                                key={`grid-level-${level}`}
                                points={pts}
                                initial={{ opacity: 0, pathLength: 0 }}
                                animate={{ opacity: 0.2, pathLength: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                            />
                        );
                    })}
                    {/* Spokes */}
                    {subjects.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                        return (
                            <motion.line
                                key={`spoke-${i}`}
                                x1={center}
                                y1={center}
                                x2={center + radius * Math.cos(angle)}
                                y2={center + radius * Math.sin(angle)}
                                initial={{ opacity: 0, pathLength: 0 }}
                                animate={{ opacity: 0.2, pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                            />
                        );
                    })}
                </g>

                {/* 2. Benchmark Polygon (Industry Avg or Elite) */}
                {benchmarkData && (
                    <motion.polygon
                        points={benchPolygon}
                        initial={{ opacity: 0, scale: 0.5, pathLength: 0 }}
                        animate={{ opacity: 1, scale: 1, pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        style={{ transformOrigin: "center" }}
                        fill={isEliteBenchmark ? "rgba(245, 158, 11, 0.15)" : "rgba(148, 163, 184, 0.15)"} // amber-500 or slate-400
                        stroke={isEliteBenchmark ? "rgba(245, 158, 11, 0.8)" : "rgba(148, 163, 184, 0.8)"}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                )}

                {/* 3. User Score Polygon */}
                <motion.polygon
                    points={userPolygon}
                    initial={{ opacity: 0, scale: 0, pathLength: 0 }}
                    animate={{ opacity: 1, scale: 1, pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
                    style={{ transformOrigin: "center" }}
                    fill="url(#userGradient)"
                    stroke="#10b981" // emerald-500
                    strokeWidth="2.5"
                />

                {/* User Score Data Points (Nodes) */}
                {userPoints.map((pt, i) => (
                    <motion.circle
                        key={`node-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={4}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                        style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                    />
                ))}

                {/* 4. Labels */}
                {subjects.map((subj, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    // Push labels slightly outside the max radius
                    const labelR = radius * 1.25;
                    const x = center + labelR * Math.cos(angle);
                    const y = center + labelR * Math.sin(angle);

                    // Simple alignment heuristic based on angle
                    let textAnchor = "middle";
                    if (Math.cos(angle) > 0.1) textAnchor = "start";
                    if (Math.cos(angle) < -0.1) textAnchor = "end";

                    return (
                        <motion.text
                            key={`label-${i}`}
                            x={x}
                            y={y}
                            fill="#64748b" // slate-500
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor={textAnchor as any}
                            alignmentBaseline="middle"
                            className="uppercase tracking-widest"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        >
                            {subj}
                        </motion.text>
                    );
                })}

                {/* Definitions for Gradients */}
                <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Legend placed absolutely over the SVG container */}
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-6 text-[10px] uppercase tracking-wider font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border-2 border-emerald-500"></div>
                    <span className="text-emerald-700">Your Score</span>
                </div>
                {benchmarkData && (
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm border-2 border-dashed ${isEliteBenchmark ? "bg-amber-500/10 border-amber-500" : "bg-slate-400/10 border-slate-400"
                            }`}></div>
                        <span className={isEliteBenchmark ? "text-amber-600" : "text-slate-500"}>
                            {isEliteBenchmark ? "Elite Leaders" : "Industry Avg"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

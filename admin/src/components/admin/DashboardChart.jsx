import React from 'react';

const DashboardChart = ({ data, color = "#3b82f6", height = 60 }) => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100; // viewBox width

    // Create points for the SVG path
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = 100 - ((val - min) / range) * 100; // Invert Y axis
        return `${x},${y}`;
    }).join(' ');

    // Area path (closed at bottom)
    const areaPath = `M0,100 ${points} L100,100 Z`;
    // Line path (stroke only)
    const linePath = `M${points.replace(/ /g, ' L')}`;

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
            height={height}
        >
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            {/* Area */}
            <path
                d={areaPath}
                fill={`url(#gradient-${color})`}
                stroke="none"
            />
            {/* Line */}
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="3" // Thicker stroke relative to 100px viewbox
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DashboardChart;

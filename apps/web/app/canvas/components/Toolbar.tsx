'use client'

import React from 'react';

type Props = {
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
    color: string;
    setColor: (color: string) => void;
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
};

export default function Toolbar({
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth
}: Props) {
    return (
        <div className="fixed top-4 left-4 bg-white shadow-lg rounded-lg p-4 space-y-4 z-50 w-60">
            <div>
                <label className="block font-medium mb-1">Tool</label>
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 rounded border ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => setTool('pen')}
                    >
                        Pen
                    </button>
                    <button
                        className={`px-3 py-1 rounded border ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => setTool('eraser')}
                    >
                        Eraser
                    </button>
                </div>
            </div>

            <div>
                <label className="block font-medium mb-1">Color</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded"
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Stroke Width</label>
                <input
                    type="range"
                    min={1}
                    max={20}
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full"
                />
                <div className="text-center text-sm mt-1">{strokeWidth}px</div>
            </div>
        </div>
    );
}

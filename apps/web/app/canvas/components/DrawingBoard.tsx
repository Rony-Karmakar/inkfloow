'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Toolbar from './Toolbar';


type LineType = {
    tool: 'pen' | 'eraser';
    points: number[];
    color: string;
    strokeWidth: number;
};

export default function DrawingBoard() {
    const [lines, setLines] = useState<LineType[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const stageRef = useRef<any>(null);

    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState<string>('#000000');
    const [strokeWidth, setStrokeWidth] = useState<number>(3);

    const handleMouseDown = (e: any) => {
        setIsDrawing(true);
        const stage = stageRef.current;
        const point = stage.getPointerPosition();
        const newLine: LineType = {
            tool,
            points: [point.x, point.y],
            color,
            strokeWidth,
        };
        setLines([...lines, newLine]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing) return;

        const stage = stageRef.current;
        const point = stage.getPointerPosition();

        let lastLine = lines[lines.length - 1];
        if (!lastLine) return;

        const updatedPoints = [...lastLine.points, point.x, point.y];
        lastLine = { ...lastLine, points: updatedPoints };

        const newLines = lines.slice(0, -1).concat(lastLine);
        setLines(newLines);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div className="h-screen w-full bg-gray-100">
            <Toolbar
                tool={tool}
                setTool={setTool}
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
            />

            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={line.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}

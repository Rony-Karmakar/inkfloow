"use client";

import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { useShapes } from "@/store/shapeStore";
import { v4 as uuid } from "uuid";
import { useRef, useState } from "react";

export default function Canvas({ tool }: { tool: string }) {
    const { shapes, addShape } = useShapes();
    const stageRef = useRef<any>(null);

    const [newShape, setNewShape] = useState<any>(null);

    const handleMouseDown = (e: any) => {
        if (!tool) return;
        const pos = e.target.getStage().getPointerPosition();

        const id = uuid();

        if (tool === "rect") {
            setNewShape({ id, type: "rect", x: pos.x, y: pos.y, width: 0, height: 0 });
        }
        if (tool === "circle") {
            setNewShape({ id, type: "circle", x: pos.x, y: pos.y, radius: 0 });
        }
        if (tool === "line") {
            setNewShape({ id, type: "line", points: [pos.x, pos.y, pos.x, pos.y] });
        }
    };

    const handleMouseMove = (e: any) => {
        if (!newShape) return;
        const pos = e.target.getStage().getPointerPosition();

        if (newShape.type === "rect") {
            setNewShape({
                ...newShape,
                width: pos.x - newShape.x,
                height: pos.y - newShape.y,
            });
        }
        if (newShape.type === "circle") {
            const dx = pos.x - newShape.x;
            const dy = pos.y - newShape.y;
            setNewShape({
                ...newShape,
                radius: Math.sqrt(dx * dx + dy * dy),
            });
        }
        if (newShape.type === "line") {
            setNewShape({
                ...newShape,
                points: [newShape.points[0], newShape.points[1], pos.x, pos.y],
            });
        }
    };

    const handleMouseUp = () => {
        if (newShape) {
            addShape(newShape);
            setNewShape(null);
        }
    };

    return (
        <Stage
            width={1000}
            height={650}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border bg-white"
        >
            <Layer>
                {shapes.map((shape) =>
                    shape.type === "rect" ? (
                        <Rect key={shape.id} {...shape} stroke="black" draggable />
                    ) : shape.type === "circle" ? (
                        <Circle key={shape.id} {...shape} stroke="black" draggable />
                    ) : (
                        <Line
                            key={shape.id}
                            points={shape.points!}
                            stroke="black"
                            strokeWidth={2}
                            draggable
                        />
                    )
                )}

                {/* Live preview while drawing */}
                {newShape &&
                    (newShape.type === "rect" ? (
                        <Rect {...newShape} stroke="black" />
                    ) : newShape.type === "circle" ? (
                        <Circle {...newShape} stroke="black" />
                    ) : (
                        <Line {...newShape} stroke="black" strokeWidth={2} />
                    ))}
            </Layer>
        </Stage>
    );
}

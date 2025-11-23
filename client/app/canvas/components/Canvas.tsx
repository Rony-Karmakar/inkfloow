"use client";

import { Stage, Layer, Rect, Circle, Line, Arrow, Ellipse } from "react-konva";
import { useShapes } from "@/store/shapeStore";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

export default function Canvas({ tool }: { tool: string }) {
    const { shapes, addShape } = useShapes();
    const stageRef = useRef<any>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [newShape, setNewShape] = useState<any>(null);

    useEffect(() => {
        const updateSize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        updateSize(); // set immediately
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);

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
        if (tool === "arrow") {
            setNewShape({ id, type: "arrow", points: [pos.x, pos.y, pos.x, pos.y] })
        }
        if (tool === "ellipse") {
            setNewShape({ id, type: "ellipse", startX: pos.x, startY: pos.y, radiusX: 0, radiusY: 0 })
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
        if (newShape.type === "arrow") {
            setNewShape({
                ...newShape,
                points: [newShape.points[0], newShape.points[1], pos.x, pos.y],
            })
        }
        if (newShape.type === "ellipse") {
            const startX = newShape.startX;
            const startY = newShape.startY;

            const dx = pos.x - startX;
            const dy = pos.y - startY;

            setNewShape({
                ...newShape,
                x: (startX + pos.x) / 2,
                y: (startY + pos.y) / 2,
                radiusX: Math.abs(dx) / 2,
                radiusY: Math.abs(dy) / 2,
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
            width={size.width}
            height={size.height}
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
                    ) : shape.type === "arrow" ? (
                        <Arrow key={shape.id} pointerLength={20} pointerWidth={10} fill="black" points={shape.points!} stroke="black" strokeWidth={2} draggable />
                    ) : shape.type === "ellipse" ? (
                        <Ellipse key={shape.id} x={shape.x} y={shape.y} radiusX={shape.radiusX!} radiusY={shape.radiusY!} stroke="black" draggable />
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
                    ) : newShape.type === "arrow" ? (
                        <Arrow {...newShape} stroke="black" strokeWidth={2} />
                    ) : newShape.type === "ellipse" ? (
                        <Ellipse {...newShape} stroke="black" />
                    ) : (
                        <Line {...newShape} stroke="black" strokeWidth={2} />
                    ))}
            </Layer>
        </Stage>
    );
}

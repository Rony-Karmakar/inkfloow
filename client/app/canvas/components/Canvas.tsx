"use client";

import { Stage, Layer, Rect, Circle, Line, Arrow, Ellipse, Text } from "react-konva";
import { useShapes } from "@/store/shapeStore";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

export default function Canvas({ tool }: { tool: string }) {
    const { shapes, addShape, updateShape } = useShapes();
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
        if (tool === "rhombus") {
            setNewShape({
                id, type: "rhombus", startX: pos.x, startY: pos.y, points: []
            });
        }
        if (tool === "text") {
            setNewShape({
                id,
                type: "text",
                x: pos.x,
                y: pos.y,
                text: "Type...",
            });
        }
        if (tool === "pencil") {
            setNewShape({
                id,
                type: "pencil",
                points: [pos.x, pos.y],
                stroke: "black",
                strokeWidth: 2,
            });
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

        if (newShape?.type === "rhombus") {
            const x1 = newShape.startX;
            const y1 = newShape.startY;
            const x2 = pos.x;
            const y2 = pos.y;

            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;

            const dx = Math.abs(x2 - x1) / 2;
            const dy = Math.abs(y2 - y1) / 2;

            setNewShape({
                ...newShape,
                points: [
                    centerX, centerY - dy,
                    centerX + dx, centerY,
                    centerX, centerY + dy,
                    centerX - dx, centerY
                ]
            });
        }

        if (newShape?.type === "pencil") {
            setNewShape({
                ...newShape,
                points: [...newShape.points!, pos.x, pos.y],
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
        >
            <Layer>
                {shapes.map((shape) =>
                    shape.type === "rect" ? (
                        <Rect key={shape.id} {...shape} stroke="black" cornerRadius={10} draggable />
                    ) : shape.type === "circle" ? (
                        <Circle key={shape.id} {...shape} stroke="black" draggable />
                    ) : shape.type === "arrow" ? (
                        <Arrow key={shape.id} pointerLength={20} pointerWidth={10} fill="black" points={shape.points!} stroke="black" strokeWidth={2} draggable />
                    ) : shape.type === "ellipse" ? (
                        <Ellipse key={shape.id} x={shape.x} y={shape.y} radiusX={shape.radiusX!} radiusY={shape.radiusY!} cornerRadius={10} stroke="black" draggable />
                    ) : shape.type === "rhombus" ? (
                        <Line
                            key={shape.id}
                            points={shape.points!}
                            closed
                            stroke="black"
                            strokeWidth={2}
                            draggable
                            tension={0.2}
                        />
                    ) : shape.type === "text" ? (
                        <Text
                            key={shape.id}
                            x={shape.x}
                            y={shape.y}
                            text={shape.text}
                            fontSize={20}
                            fill="black"
                            draggable

                            onDblClick={(e) => {
                                const textPosition = e.target.getAbsolutePosition();
                                const stageBox = stageRef.current.container().getBoundingClientRect();

                                const textarea = document.createElement("textarea");
                                document.body.appendChild(textarea);

                                textarea.value = shape.text!;
                                textarea.style.position = "absolute";
                                textarea.style.top = stageBox.top + textPosition.y + "px";
                                textarea.style.left = stageBox.left + textPosition.x + "px";
                                textarea.style.fontSize = shape.fontSize + "px";

                                textarea.focus();

                                textarea.addEventListener("keydown", (e) => {
                                    if (e.key === "Enter") {
                                        updateShape(shape.id, { text: textarea.value });
                                        document.body.removeChild(textarea);
                                    }
                                });
                            }}
                        />
                    ) : shape.type === "pencil" ? (
                        <Line
                            key={shape.id}
                            points={shape.points!}
                            stroke="black"
                            strokeWidth={2}
                            lineCap="round"
                            lineJoin="round"
                        />
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
                        <Rect {...newShape} stroke="black" cornerRadius={10} />
                    ) : newShape.type === "circle" ? (
                        <Circle {...newShape} stroke="black" />
                    ) : newShape.type === "arrow" ? (
                        <Arrow {...newShape} stroke="black" strokeWidth={2} pointerLength={20} pointerWidth={10} fill="black" />
                    ) : newShape.type === "ellipse" ? (
                        <Ellipse {...newShape} stroke="black" />
                    ) : newShape.type === "pencil" ? (
                        <Line
                            points={newShape.points!}
                            stroke="black"
                            strokeWidth={2}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ) : newShape.type === "rhombus" ? (
                        (
                            <Line
                                points={newShape.points!}
                                closed
                                stroke="black"
                                strokeWidth={2}
                                cornerRadius={10}
                                tension={0.2}
                            />
                        )
                    ) : (
                        <Line {...newShape} stroke="black" strokeWidth={2} />
                    ))}
            </Layer>
        </Stage>
    );
}

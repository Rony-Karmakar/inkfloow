"use client";

import { useState } from "react";
import { Circle, MoveUpLeft, RectangleHorizontal, Minus, Diamond } from "lucide-react"

export default function Toolbar({ onSelectTool }: { onSelectTool: (tool: string) => void }) {
    const [selected, setSelected] = useState("");

    const tools = ["rect", "circle", "line", "arrow", "ellipse", "rhombus"];

    return (
        <div className="flex items-center gap-4 mt-5 bg-neutral-100 rounded-lg p-2">
            {tools.map((tool) => (
                <div
                    key={tool}
                    onClick={() => {
                        setSelected(tool);
                        onSelectTool(tool);
                    }}
                    className={`p-2 rounded-lg ${selected === tool ? "bg-emerald-200 text-white" : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                >
                    {tool == "circle" ? <Circle className="w-4 h-4" /> : tool === "rect" ? <RectangleHorizontal className="w-4 h-4" /> : tool == "arrow" ? <MoveUpLeft className="w-4 h-4" /> : tool == "line" ? <Minus className="w-4 h-4" /> : tool == "rhombus" ? <Diamond className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </div>
            ))}
        </div>
    );
}

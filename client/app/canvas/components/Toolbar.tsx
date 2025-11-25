"use client";

import { useState } from "react";
import { Circle, MoveUpLeft, RectangleHorizontal, Minus, Diamond, TextCursor } from "lucide-react"

export default function Toolbar({ onSelectTool }: { onSelectTool: (tool: string) => void }) {
    const [selected, setSelected] = useState("");

    const tools = ["rect", "line", "arrow", "ellipse", "rhombus", "text"];

    return (
        <div className="flex items-center gap-3 bg-neutral-100 rounded-lg p-1.5">
            {tools.map((tool) => (
                <button
                    key={tool}
                    onClick={() => {
                        setSelected(tool);
                        onSelectTool(tool);
                    }}
                    className={`p-2 rounded-lg ${selected === tool ? "bg-emerald-200 text-neutral-600" : "bg-neutral-100 hover:bg-emerald-100 text-neutral-700"
                        }`}
                >
                    {
                        tool === "rect" ? <RectangleHorizontal className="w-4 h-4" />
                            : tool == "arrow" ? <MoveUpLeft className="w-4 h-4" />
                                : tool == "line" ? <Minus className="w-4 h-4" />
                                    : tool == "rhombus" ? <Diamond className="w-4 h-4" />
                                        : tool == "text" ? <TextCursor className="w-4 h-4" />
                                            : <Circle className="w-4 h-4" />
                    }
                </button>
            ))}
        </div>
    );
}

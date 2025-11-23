"use client";

import { useState } from "react";

export default function Toolbar({ onSelectTool }: { onSelectTool: (tool: string) => void }) {
    const [selected, setSelected] = useState("");

    const tools = ["rect", "circle", "line", "arrow", "ellipse"];

    return (
        <div className="p-2 flex gap-2 bg-gray-200 border-b">
            {tools.map((tool) => (
                <button
                    key={tool}
                    onClick={() => {
                        setSelected(tool);
                        onSelectTool(tool);
                    }}
                    className={`px-3 py-1 rounded ${selected === tool ? "bg-blue-500 text-white" : "bg-white"
                        }`}
                >
                    {tool.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

"use client";

import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";

export default function Home() {
    const [tool, setTool] = useState("");

    return (
        <div className="h-screen flex flex-col items-center gap-2">
            <Toolbar onSelectTool={setTool} />
            <Canvas tool={tool} />
        </div>
    );
}

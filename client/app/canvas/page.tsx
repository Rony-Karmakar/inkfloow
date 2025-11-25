"use client";

import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import Menubar from "./components/Menubar";
import { Share2 } from "lucide-react";

export default function Home() {
    const [tool, setTool] = useState("");

    return (
        <div className="relative w-full h-full px-4 flex flex-col items-center gap-2">
            <div className="flex mt-4 justify-between items-center w-full">
                <Menubar />
                <Toolbar onSelectTool={setTool} />
                <div><button className="bg-emerald-300 p-2 rounded-lg text-neutral-600"><Share2 className="w-5 h-5" /></button></div>
            </div>
            <Canvas tool={tool} />
        </div>
    );
}

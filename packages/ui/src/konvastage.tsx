'use client'

import { Stage, Layer, Line } from 'react-konva'
import { useEffect, useState } from 'react'

export default function KonvaStage() {
    const [lines, setLines] = useState<any[]>([])
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }, [])

    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition()
        setLines([...lines, { points: [pos.x, pos.y] }])
    }

    const handleMouseMove = (e: any) => {
        if (lines.length === 0) return
        const pos = e.target.getStage().getPointerPosition()
        const newLines = [...lines]
        const lastLine = { ...newLines[newLines.length - 1] }
        lastLine.points = lastLine.points.concat([pos.x, pos.y])
        newLines[newLines.length - 1] = lastLine
        setLines(newLines)
    }

    if (dimensions.width === 0) return null

    return (
        <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke="black"
                        strokeWidth={2}
                        tension={0.5}
                        lineCap="round"
                    />
                ))}
            </Layer>
        </Stage>
    )
}

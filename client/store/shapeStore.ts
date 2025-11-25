import { create } from "zustand";

export type Shape = {
    id: string;
    type: "rect" | "circle" | "line" | "arrow" | "ellipse" | "rhombus" | "text";
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pointerLength?: number;
    pointerWidth?: number;
    radius?: number;
    radiusX?: number;
    radiusY?: number;
    points?: number[];
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string; // normal | bold | italic
    fill?: string; // text color
    rotation?: number;
    align?: "left" | "center" | "right";
};

type Store = {
    shapes: Shape[];
    addShape: (shape: Shape) => void;
    updateShape: (id: string, newProps: Partial<Shape>) => void;
};

export const useShapes = create<Store>((set) => ({
    shapes: [],
    addShape: (shape) =>
        set((state) => ({ shapes: [...state.shapes, shape] })),
    updateShape: (id, newProps) =>
        set((state) => ({
            shapes: state.shapes.map((shape) =>
                shape.id === id ? { ...shape, ...newProps } : shape
            ),
        })),
}));

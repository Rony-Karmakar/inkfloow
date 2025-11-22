import { create } from "zustand";

export type Shape = {
    id: string;
    type: "rect" | "circle" | "line";
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: number[];
};

type Store = {
    shapes: Shape[];
    addShape: (shape: Shape) => void;
};

export const useShapes = create<Store>((set) => ({
    shapes: [],
    addShape: (shape) =>
        set((state) => ({ shapes: [...state.shapes, shape] })),
}));

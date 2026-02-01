
export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Rect extends Point, Size { }

export interface BaseOptions {
    opacity?: number;
    color?: string; // Background/Fill color
    textColor?: string;
    fontSize?: number; // New: Configurable font size
}

export interface BadgeOptions extends BaseOptions {
    target: Point; // Tip of the connector
    center?: Point; // Center of the badge (optional, calculated if not provided)
    offset?: Point; // Offset from target (alternative to center)
    paddingScale?: number; // Multiplier for padding (default 1.0)
}

export interface BubbleOptions extends BaseOptions {
    target: Point;
    center?: Point; // Top-left or Center depends on impl, let's standardize on Center for easier logic
    width?: number; // Optional, auto-calculated if missing
    height?: number;
    tailPosition?: 'top' | 'bottom' | 'left' | 'right'; // Hint for tail drawing
}

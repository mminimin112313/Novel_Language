export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Rect extends Point, Size {
}
export interface BaseOptions {
    opacity?: number;
    color?: string;
    textColor?: string;
    fontSize?: number;
}
export interface BadgeOptions extends BaseOptions {
    target: Point;
    center?: Point;
    offset?: Point;
    paddingScale?: number;
}
export interface BubbleOptions extends BaseOptions {
    target: Point;
    center?: Point;
    width?: number;
    height?: number;
    tailPosition?: 'top' | 'bottom' | 'left' | 'right';
}

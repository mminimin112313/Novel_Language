import { Rect } from '../types.js';
/**
 * Draws a bounding box on an image.
 */
export declare function drawBox(inputPath: string, outputPath: string, rect: Rect, color?: string): Promise<void>;
/**
 * Adds a text memo to the image.
 */
export declare function addMemo(inputPath: string, outputPath: string, text: string, position?: 'top-left' | 'bottom-right'): Promise<void>;

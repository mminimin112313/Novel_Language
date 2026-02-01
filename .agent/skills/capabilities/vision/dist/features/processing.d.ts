export declare function crop(inputPath: string, outputPath: string, rect: {
    left: number;
    top: number;
    width: number;
    height: number;
}): Promise<void>;
export declare function analyzeText(inputPath: string): Promise<string>;
export declare function stitchImages(inputPaths: string[], outputPath: string, direction?: 'vertical' | 'horizontal'): Promise<void>;

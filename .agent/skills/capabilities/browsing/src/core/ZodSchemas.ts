/**
 * Zod Schemas for Browsing Skill Commands
 * Based on BrowserMCP tool patterns
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// --- Navigation Schemas ---

export const NavigateSchema = z.object({
    url: z.string().url('Must be a valid URL'),
    waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle']).optional().default('domcontentloaded')
});

export const GoBackSchema = z.object({});

export const GoForwardSchema = z.object({});

// --- Interaction Schemas ---

export const ClickSchema = z.object({
    selector: z.string().min(1, 'Selector is required'),
    button: z.enum(['left', 'right', 'middle']).optional().default('left'),
    clickCount: z.number().int().min(1).max(3).optional().default(1)
});

export const TypeSchema = z.object({
    selector: z.string().min(1, 'Selector is required'),
    text: z.string(),
    delay: z.number().int().min(0).optional()
});

export const HoverSchema = z.object({
    selector: z.string().min(1, 'Selector is required')
});

export const DragSchema = z.object({
    startSelector: z.string().min(1, 'Start selector is required'),
    endSelector: z.string().min(1, 'End selector is required')
});

export const SelectOptionSchema = z.object({
    selector: z.string().min(1, 'Selector is required'),
    value: z.string().optional(),
    label: z.string().optional(),
    index: z.number().int().min(0).optional()
}).refine(
    data => data.value !== undefined || data.label !== undefined || data.index !== undefined,
    { message: 'At least one of value, label, or index must be provided' }
);

export const PressKeySchema = z.object({
    key: z.string().min(1, 'Key is required'),
    modifiers: z.array(z.enum(['Control', 'Shift', 'Alt', 'Meta'])).optional()
});

// --- Discovery Schemas ---

export const SnapshotSchema = z.object({
    includeAccessibility: z.boolean().optional().default(true),
    includeVisualMap: z.boolean().optional().default(false)
});

export const InspectAtSchema = z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0)
});

// --- Custom Schemas ---

export const WaitSchema = z.object({
    time: z.number().min(0).max(30, 'Maximum wait time is 30 seconds')
});

export const ExecuteJSSchema = z.object({
    code: z.string().min(1, 'JavaScript code is required')
});

export const ScreenshotSchema = z.object({
    fullPage: z.boolean().optional().default(false),
    path: z.string().optional()
});

// --- Schema Registry ---

export const Schemas = {
    // Navigation
    navigate: NavigateSchema,
    open: NavigateSchema,
    goBack: GoBackSchema,
    goForward: GoForwardSchema,

    // Interaction
    click: ClickSchema,
    type: TypeSchema,
    fill: TypeSchema,
    hover: HoverSchema,
    drag: DragSchema,
    selectOption: SelectOptionSchema,
    pressKey: PressKeySchema,

    // Discovery
    snapshot: SnapshotSchema,
    'aria-snapshot': SnapshotSchema,
    inspectAt: InspectAtSchema,

    // Custom
    wait: WaitSchema,
    executeJS: ExecuteJSSchema,
    screenshot: ScreenshotSchema
} as const;

// Type inference helper
export type SchemaType<K extends keyof typeof Schemas> = z.infer<typeof Schemas[K]>;

// JSON Schema export for documentation
export function getJsonSchema(name: keyof typeof Schemas) {
    const schema = Schemas[name];
    // Type assertion needed because zodToJsonSchema expects ZodType
    return zodToJsonSchema(schema as z.ZodType);
}

// Validation helper
export function validate<K extends keyof typeof Schemas>(
    name: K,
    data: unknown
): z.infer<typeof Schemas[K]> {
    const schema = Schemas[name];
    return schema.parse(data);
}


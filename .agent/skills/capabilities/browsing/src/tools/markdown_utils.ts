import TurndownService from 'turndown';

export function convertToMarkdown(html: string): string {
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });
    
    // Basic cleanup before conversion if needed
    // turndownService.remove(['script', 'style', 'iframe', 'noscript']);
    
    return turndownService.turndown(html);
}

export function extractMainContent(html: string): string {
    // This could be improved with JSDOM or similar, 
    // but for now, we'll let turndown handle the whole body or a specific part
    return convertToMarkdown(html);
}

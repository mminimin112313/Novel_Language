import TurndownService from 'turndown';

export class RefinementService {
    private turndown: TurndownService;

    constructor() {
        this.turndown = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
    }

    convertToMarkdown(html: string): string {
        return this.turndown.turndown(html);
    }
}

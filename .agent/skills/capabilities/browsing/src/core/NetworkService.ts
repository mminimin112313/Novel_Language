import { Page, Request, Response } from 'playwright-core';

export interface NetworkLog {
    url: string;
    method: string;
    status?: number;
    requestHeaders?: any;
    responseHeaders?: any;
    requestPayload?: any;
    responsePayload?: any;
    timestamp: number;
}

export class NetworkService {
    private logs: NetworkLog[] = [];
    private isInterceptionEnabled: boolean = false;

    setupInterception(page: Page) {
        if (this.isInterceptionEnabled) return;

        page.on('request', async (request: Request) => {
            const log: NetworkLog = {
                url: request.url(),
                method: request.method(),
                requestHeaders: request.headers(),
                requestPayload: request.postData(),
                timestamp: Date.now()
            };
            this.logs.push(log);
        });

        page.on('response', async (response: Response) => {
            const url = response.url();
            const log = this.logs.find(l => l.url === url && !l.status);
            if (log) {
                log.status = response.status();
                log.responseHeaders = response.headers();

                // Try to get response body for small JSON/Text responses
                const contentType = response.headers()['content-type'] || '';
                if (contentType.includes('application/json') || contentType.includes('text/plain')) {
                    try {
                        const body = await response.text();
                        log.responsePayload = body.slice(0, 1000); // Truncate for safety
                    } catch (e) {
                        // Response might be gone or not readable
                    }
                }
            }
        });

        this.isInterceptionEnabled = true;
    }

    getLogs(): NetworkLog[] {
        return [...this.logs];
    }

    clearLogs() {
        this.logs = [];
    }
}

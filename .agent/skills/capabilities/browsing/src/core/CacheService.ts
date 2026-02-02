import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export class CacheService {
    private cacheDir: string;
    private defaultTtlMs: number;

    constructor(baseDir: string, defaultTtlMinutes: number = 60) {
        this.cacheDir = path.join(baseDir, '.agent', 'data', 'cache', 'browsing');
        this.defaultTtlMs = defaultTtlMinutes * 60 * 1000;
        this.ensureCacheDir();
    }

    private ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }

    private getCacheKey(key: string): string {
        return crypto.createHash('md5').update(key).digest('hex');
    }

    private getFilePath(key: string): string {
        return path.join(this.cacheDir, `${this.getCacheKey(key)}.json`);
    }

    public set<T>(key: string, data: T, ttlMinutes?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlMinutes ? ttlMinutes * 60 * 1000 : this.defaultTtlMs
        };
        fs.writeFileSync(this.getFilePath(key), JSON.stringify(entry));
    }

    public get<T>(key: string): T | null {
        const filePath = this.getFilePath(key);
        if (!fs.existsSync(filePath)) {
            return null;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const entry: CacheEntry<T> = JSON.parse(content);
            const age = Date.now() - entry.timestamp;

            if (age > entry.ttl) {
                fs.unlinkSync(filePath); // Expired
                return null;
            }

            return entry.data;
        } catch (e) {
            console.error(`Failed to read cache for key: ${key}`, e);
            return null;
        }
    }

    public clear(): void {
        if (fs.existsSync(this.cacheDir)) {
            fs.rmSync(this.cacheDir, { recursive: true, force: true });
            this.ensureCacheDir();
        }
    }
}

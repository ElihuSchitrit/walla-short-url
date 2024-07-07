import { Injectable, NotFoundException } from '@nestjs/common';
import * as dns from 'dns/promises';

@Injectable()
export class UrlService {
    private urlMap = new Map<string, { originalUrl: string; shortenedUrl: string; ip: string }>();

    async shorten(originalUrl: string): Promise<{ originalUrl: string; shortenedUrl: string; ip: string }> {
        const { hostname } = new URL(originalUrl);

        try {
            const { address } = await dns.lookup(hostname, { family: 4 });
            const shortUrlKey = Math.random().toString(36).substring(2, 8);
            const shortenedUrl = `http://localhost:3001/url/${shortUrlKey}`;
            
            this.urlMap.set(shortUrlKey, { originalUrl, shortenedUrl, ip: address });
            
            return {
                originalUrl,
                shortenedUrl,
                ip: address
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`DNS lookup failed for ${hostname}: ${error.message}`);
                // You might consider logging the entire error for more detailed diagnostics
                throw new NotFoundException('Invalid URL or domain not found');  // This is correctly thrown here
            } else {
                // This else block is good practice for catching extremely unusual errors.
                throw new Error('An unexpected error occurred');
            }
        }
    }

    expand(shortUrlKey: string): { originalUrl: string; ip: string } {
        const urlData = this.urlMap.get(shortUrlKey);
        if (!urlData) {
            console.error(`Key not found: ${shortUrlKey}`);
            throw new NotFoundException('URL not found');
        }
        return { originalUrl: urlData.originalUrl, ip: urlData.ip };
    }
}
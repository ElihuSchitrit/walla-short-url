import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { ShortenUrlDto, ExpandUrlDto } from './url.dto';
import { Response } from 'express';

@ApiTags('url')
@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Post('shorten')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Shorten a URL' })
    @ApiResponse({ status: 201, description: 'URL successfully shortened', type: String })
    @ApiBody({ type: ShortenUrlDto })
    async shortenUrl(@Body() dto: ShortenUrlDto, @Res() res: Response) {
        try {
            const result = await this.urlService.shorten(dto.url);
            res.json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'An unknown error occurred' });
            }
        }
    }

    @Post('expand')
    @ApiOperation({ summary: 'Expand a shortened URL' })
    @ApiResponse({ status: 200, description: 'URL successfully expanded', type: String })
    @ApiBody({ type: ExpandUrlDto })
    expandUrl(@Body() dto: ExpandUrlDto, @Res() res: Response) {
        try {
            const urlPrefix = 'http://localhost:3001/url/';
            const shortUrlKey = dto.url.replace(urlPrefix, '');
            const result = this.urlService.expand(shortUrlKey);
            res.json({ originalUrl: result.originalUrl });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL not found' });
        }
    }

    @Get('/:shortUrl')
    @ApiOperation({ summary: 'Redirect to the original URL' })
    @ApiResponse({ status: 302, description: 'Redirecting to original URL' })
    async redirectToOriginalUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
        try {
            const urlData = this.urlService.expand(shortUrl);
            return res.redirect(urlData.originalUrl);
        } catch (error) {
            return res.status(404).json({ error: 'URL not found' });
        }
    }
}

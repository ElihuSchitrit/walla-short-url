import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The URL to be shortened',
    default: 'https://example.com'
  })
  url: string;
}

export class ExpandUrlDto {
  @ApiProperty({
    example: 'http://localhost:3000/url/abcdef',
    description: 'The shortened URL to be expanded',
    default: 'http://localhost:3000/url/abcdef'
  })
  url: string;
}

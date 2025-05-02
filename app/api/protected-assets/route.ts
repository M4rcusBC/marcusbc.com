import { NextRequest, NextResponse } from 'next/server';
import { useUser } from '@stackframe/stack';
import path from 'path';
import fs from 'fs/promises';

// Define where your protected assets are stored
const PROTECTED_ASSETS_DIR = path.join(process.cwd(), 'protected-assets');

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = useUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the requested file from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }

    // Prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(PROTECTED_ASSETS_DIR, sanitizedFilename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine MIME type (basic implementation)
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Add more MIME types as needed
    };
    
    const contentType = mimeTypes[extension] || 'application/octet-stream';
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving protected file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
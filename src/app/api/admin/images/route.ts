import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

// Liste toutes les images de public/images (chemins utilisables dans <img src>)
function walk(dir: string, base: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = `${base}/${entry.name}`;
    if (entry.isDirectory()) walk(full, rel, out);
    else if (IMAGE_EXT.test(entry.name)) out.push(rel);
  }
}

export async function GET() {
  const root = path.join(process.cwd(), 'public', 'images');
  const out: string[] = [];
  if (fs.existsSync(root)) walk(root, '/images', out);
  out.sort();
  return NextResponse.json(out);
}

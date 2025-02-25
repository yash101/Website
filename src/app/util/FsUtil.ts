import fs from 'fs/promises';
import path from 'path';

import { notFound } from 'next/navigation';

import { PUBLIC_PATH } from './Constants';

// Utility function for file reading
export async function readJsonFile<T>(filepath: string): Promise<T> {
  try {
    return await fs.readFile(getPathInPublic(filepath), 'utf8').then(JSON.parse) as T;
  } catch (error) {
    console.error(`Error reading file ${filepath}:`, error);
    notFound();
  }
}

export function getPathInPublic(...paths: string[]): string {
  return path.join(PUBLIC_PATH, ...paths);
}

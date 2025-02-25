import fs from 'fs/promises';
import { PPPage } from 'notebook/types';
import { getPathInPublic } from './IndexUtils';
import { notFound } from 'next/navigation';

// Utility function for file reading
export async function readJsonFile<T>(filepath: string): Promise<T> {
  try {
    return await fs.readFile(getPathInPublic(filepath), 'utf8').then(JSON.parse) as T;
  } catch (error) {
    console.error(`Error reading file ${filepath}:`, error);
    notFound();
  }
}

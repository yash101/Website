import fs from 'fs/promises';
import path from 'path';

export async function findFilesRecursively(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await findFilesRecursively(filePath);
      results.push(...subFiles);
    } else {
      results.push(filePath);
    }
  }

  return results;
}

export async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

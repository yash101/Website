import fs from 'fs/promises';
import path from 'path';

export async function* findFiles(dir) {
  const queue = [ dir ];
  while (queue.length !== 0) {
    const directory = queue.shift();
    const entries = await fs
      .readdir(directory, { withFileTypes: true })
      .catch(e => console.error('Failed to read directory', directory, e));

    for (const entry of entries) {
      if (entry.isDirectory()) {
        queue.push(path.join(directory, entry.name));
      } else if (entry.isFile()) {
        yield path.join(directory, entry.name);
      }
    }
  }
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

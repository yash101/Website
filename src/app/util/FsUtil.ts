import fs from 'fs/promises';
import { PPPage } from 'notebook/types';
import { getPathInPublic } from './IndexUtils';

export async function readNotebook(nbPath: string): Promise<PPPage> {
  return await fs
    .readFile(getPathInPublic(nbPath), 'utf8')
    .then(JSON.parse) as PPPage;
}

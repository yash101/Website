export function filepathMatchBlogs(filepath: string): boolean {
  return filepath.match(/^ipynb_pp\/blogs\/.*.dnb$/) ? true : false;
}

export function filepathMatchPages(filepath: string): boolean {
  return filepath.match(/^ipynb_pp\/pages\/.*.dnb$/) ? true : false;
}

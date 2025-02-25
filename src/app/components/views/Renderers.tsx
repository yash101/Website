import { PPPage } from "notebook/types";

export interface PageRendererInterface {
  root: string;
  name: string;
  pageno: number;
  page: PPPage;
}

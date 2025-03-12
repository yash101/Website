import { PPSectionOutput } from "./types";

export type NotebookUnderTransformation = {
  cells?: NUTCell[];
  metadata?: Record<string, string | object>;
  nbformat?: number;
  nbformat_minor?: number;
  additionalRawHtml?: string;
}

export type NUTCell = {
  cell_type: string;
  id?: string;
  metadata?: object;
  source?: string | string[];
  outputs?: PPSectionOutput[];
  attachments?: Record<string, Record<string, string>>;
  execution_count?: unknown;
  hidden?: boolean;
}

export type NUTAttachment = {
  name: string;
  data: string | Buffer;
  metadata: Record<string, string | number> | null;
}

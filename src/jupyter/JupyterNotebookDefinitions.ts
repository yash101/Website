export interface JupyterMetadata {
  [key: string]: any;
}

export interface JupyterAttachments {
  [key: string]: { [mime: string]: string };
}

export interface PageMetadata {
  title: string;
  lastModified: Date;
  initialPublish: Date;
}

export interface JupyterCell {
  cell_type: string;
  source: string[];
  metadata?: JupyterMetadata;
  execution_count?: number;
  outputs: string[];
  attachments?: JupyterAttachments;

  [key: string]: any;
}

export interface JupyterNotebook {
  cells?: JupyterCell[];
  metadata: JupyterMetadata;
  nbformat: number;
  nbformat_minor: number;

  [key: string]: any;
}

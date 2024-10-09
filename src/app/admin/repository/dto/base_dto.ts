export type BaseDTO = {
  id?: number;
  name: string;
  description?: string;
}

export type DeletableDTO = {
  deleted: boolean;
}

export type VersionableDTO = {
  version: number;
}

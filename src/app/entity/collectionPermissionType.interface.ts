export interface ICollectionPermissionType {
  id?: number;
  name: string;
  description?: string;
}

export enum en_CollectionPermissionType {
  VIEW = 1,
  EDIT = 2,
  ADMIN = 3,
}

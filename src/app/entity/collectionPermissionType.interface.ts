// export class CreateCollectionPermissionTypeDto {
//     @ApiProperty({enum: ['read', 'write', 'admin'], example: 'read'})
//     name: string;
//     @ApiProperty({ example: 'Permissão de leitura para a coleção.' })
//     description?: string;
// }

export interface ICollectionPermissionType {
  id?: number;
  name: string;
  description?: string;
}

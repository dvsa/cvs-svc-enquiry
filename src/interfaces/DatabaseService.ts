import { FieldPacket, RowDataPacket } from 'mysql2';

export default interface DatabaseService {
  get(query: string, params: string[] | undefined): Promise<[RowDataPacket[], FieldPacket[]]>;
}

import { FieldPacket, RowDataPacket } from 'mysql2/promise';

export type QueryOutput = [RowDataPacket[], FieldPacket[]];

export default interface DatabaseService {
  get(query: string, params: string[] | undefined): Promise<[RowDataPacket[], FieldPacket[]]>
}

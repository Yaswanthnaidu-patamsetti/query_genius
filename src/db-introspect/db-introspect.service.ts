// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class DbIntrospectService {
//   constructor(private prisma: PrismaService) {}

//   async getSchemaDetails(): Promise<{ table: string; columns: string[] }[]> {
//     const tables: { table_name: string }[] = await this.prisma.$queryRawUnsafe(
//       `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`,
//     );

//     const results: { table: string; columns: string[] }[] = [];

//     for (const table of tables) {
//       if (
//         table.table_name === '_prisma_migrations' ||
//         table.table_name === 'users' ||
//         table.table_name === 'chocolates' ||
//         table.table_name === 'questions'
//       )
//         continue;
//       const columns: { column_name: string }[] =
//         await this.prisma.$queryRawUnsafe(
//           `SELECT column_name FROM information_schema.columns WHERE table_name = '${table.table_name}';`,
//         );

//       results.push({
//         table: table.table_name,
//         columns: columns.map((col) => col.column_name),
//       });
//     }

//     return results;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@Injectable()
export class DbIntrospectService {
  constructor(private prisma: PrismaService) {}

  async getSchemaDetails(
    targetTableName?: string,
  ): Promise<{ table: string; columns: { name: string; type: string }[] }[]> {
    const restrictedTables = ['_prisma_migrations', 'users', 'questions'];
    if (targetTableName) {
      if (restrictedTables.includes(targetTableName)) return [];

      const columns: { column_name: string; data_type: string }[] =
        await this.prisma.$queryRawUnsafe(
          `SELECT column_name, data_type 
           FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = '${targetTableName}';`,
        );

      if (columns.length === 0) return [];

      return [
        {
          table: targetTableName,
          columns: columns.map((col) => ({
            name: col.column_name,
            type: col.data_type,
          })),
        },
      ];
    }

    // fallback to full scan if no specific table is provided
    const tables: { table_name: string }[] = await this.prisma.$queryRawUnsafe(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public';`,
    );

    const results: {
      table: string;
      columns: { name: string; type: string }[];
    }[] = [];

    for (const table of tables) {
      const tableName = table.table_name;

      if (restrictedTables.includes(tableName)) continue;

      const columns: { column_name: string; data_type: string }[] =
        await this.prisma.$queryRawUnsafe(
          `SELECT column_name, data_type 
           FROM information_schema.columns 
           WHERE table_name = '${tableName}';`,
        );

      results.push({
        table: tableName,
        columns: columns.map((col) => ({
          name: col.column_name,
          type: col.data_type,
        })),
      });
    }

    return results;
  }
}

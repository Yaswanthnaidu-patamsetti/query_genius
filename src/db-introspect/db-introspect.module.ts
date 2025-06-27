import { Module } from '@nestjs/common';
import { DbIntrospectService } from './db-introspect.service';

@Module({
  providers: [DbIntrospectService],
  exports: [DbIntrospectService],
})
export class DbIntrospectModule {}

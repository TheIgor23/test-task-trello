import { Module } from '@nestjs/common';
import { ColumnsController } from './column.controller';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Col } from './column.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Col])],
    controllers: [ColumnsController],
    providers: [ColumnService],
    exports: [ColumnService],
})
export class ColumnModule {}

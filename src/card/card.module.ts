import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { ColumnModule } from 'src/column/column.module';

@Module({
    imports: [TypeOrmModule.forFeature([Card]), ColumnModule],
    controllers: [CardController],
    providers: [CardService],
})
export class CardModule {}

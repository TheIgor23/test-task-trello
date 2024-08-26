import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { ColumnModule } from 'src/column/column.module';
import { Col } from 'src/column/column.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Card, Col]), ColumnModule],
    controllers: [CardController],
    providers: [CardService],
})
export class CardModule {}

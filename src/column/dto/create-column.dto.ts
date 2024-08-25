import { OmitType } from '@nestjs/swagger';
import { ColumnDto } from './column.dto';

export class CreateColumnDto extends OmitType(ColumnDto, ['id']) {}

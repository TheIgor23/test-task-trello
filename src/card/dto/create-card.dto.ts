import { OmitType } from '@nestjs/swagger';
import { CardDto } from './card.dto';

export class CreateCardDto extends OmitType(CardDto, ['id']) {}

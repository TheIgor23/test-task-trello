import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { ColumnService } from '../column.service';

@Injectable()
export class IsColumnExist implements CanActivate {
    constructor(private readonly columnService: ColumnService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const columnId = request.params.columnId;
        const userId = request.params.userId;
        try {
            const column = await this.columnService.getOneOrThrow(
                columnId,
                userId,
            );
            if (!column)
                throw new NotFoundException(
                    `Column with id ${columnId} not found`,
                );
        } catch {
            throw new NotFoundException(`Column with id ${columnId} not found`);
        }

        return true;
    }
}

import {
    CanActivate,
    ExecutionContext,
    Inject,
    NotFoundException,
    Type,
    mixin,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

const EntityExist = (entityClass, paramName): Type<CanActivate> => {
    class EntityExistMixin {
        constructor(
            @Inject(DataSource) private readonly dataSource: DataSource,
        ) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const request = context.switchToHttp().getRequest<Request>();
            const entity = await this.dataSource
                .getRepository(entityClass)
                .findOneBy({ id: Number(request.params[paramName]) });
            if (!entity) {
                throw new NotFoundException(`${paramName} not found`);
            }
            return true;
        }
    }
    return mixin(EntityExistMixin);
};
export default EntityExist;

function getNestedObject(obj, key) {
    return key.split('.').reduce(function (o, x) {
        return typeof o == 'undefined' || o === null ? o : o[x];
    }, obj);
}

import {
    CanActivate,
    ExecutionContext,
    Inject,
    NotFoundException,
    ForbiddenException,
    Type,
    mixin,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

const IsOwner = (
    entityClass: Function,
    paramName: string,
    ownerKey?: string,
): Type<CanActivate> => {
    class ScopeGuardMixin implements CanActivate {
        constructor(
            @Inject(DataSource) private readonly dataSource: DataSource,
        ) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const request = context.switchToHttp().getRequest();

            if (!request.user) throw new NotFoundException('User not found');
            const user = request.user;
            const entityId = Number(request.params[paramName]);

            if (request.params.userId != request.user.id)
                throw new ForbiddenException('You do not own this resource');

            if (!ownerKey) return true;

            const entity = await this.dataSource
                .getRepository(entityClass)
                .findOne({ where: { id: entityId }, relations: [ownerKey] });

            if (!entity) {
                throw new NotFoundException(`${paramName} not found`);
            }

            const owner = getNestedObject(entity, ownerKey);

            if (owner.id != user.id) {
                throw new ForbiddenException('You do not own this resource');
            }

            return true;
        }
    }

    return mixin(ScopeGuardMixin);
};

export default IsOwner;

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IsOwner implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user) return false;
        return request.params.userId == request.user.id;
    }
}

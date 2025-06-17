import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/src/prisma.service';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const staffId = request.user.id;
        const taskId = request.params.taskId;

        const taskStaff = await this.prisma.taskStaff.findFirst({
            where: {
                taskId: +taskId,
                staffId: staffId,
            },
        });

        if (!taskStaff) {
            throw new ForbiddenException('You do not have access to this task');
        }

        return true;
    }
} 
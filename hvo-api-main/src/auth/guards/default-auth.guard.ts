import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { IS_LOCKED_KEY } from 'src/decorators/locked.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class c extends FirebaseAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService) protected readonly users: UserService,
    protected readonly config: ConfigService
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if route requires special access token
    const isLocked = this.reflector.getAllAndOverride<boolean>(IS_LOCKED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isLocked) {
      const accessToken = request.headers['access_token'] as string;
      if (accessToken !== this.config.get<string>('ACCESS_TOKEN')) {
        throw new UnauthorizedException('Invalid access token for locked resource');
      }
      return true;
    }

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    // For protected routes, use the standard Firebase auth guard
    return super.canActivate(context);
  }
}
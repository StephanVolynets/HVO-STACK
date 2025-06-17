import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { getAuth } from "firebase-admin/auth";
import { ExtractJwt } from "passport-firebase-jwt";
import { Observable } from "rxjs";
import { IS_LOCKED_KEY } from "src/decorators/locked.decorator";
import { UserService } from "src/user/user.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { FirebaseAuthGuard } from "./guards/firebase-auth.guard";

@Injectable()
export class DefaultAuthGuard extends FirebaseAuthGuard {
  constructor(private readonly reflector: Reflector, @Inject(UserService) protected readonly users: UserService, protected readonly config: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if route requires special access token
    const isLocked = this.reflector.get<boolean>(IS_LOCKED_KEY, context.getHandler());
    if (isLocked) {
      const accessToken = request.headers["access_token"] as string;
      if (accessToken !== this.config.get("ACCESS_TOKEN")) {
        throw new UnauthorizedException("Invalid access token for locked resource");
      }
      return true;
    }

    // Check if route is marked as public
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      // If no token on public route, allow access but with no user context
      if (!token) {
        return true;
      }

      // If token provided on public route, verify and attach user
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        request.user = await this.users.getUser(decodedToken.uid);
        return !!request.user;
      } catch (error) {
        // Token invalid but route is public, so still allow access
        return true;
      }
    }

    // For protected routes, use the standard Firebase auth guard
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      if (!token) {
        throw new UnauthorizedException("No authentication token provided");
      }

      const decodedToken = await getAuth().verifyIdToken(token);
      const user = await this.users.getUser(decodedToken.uid);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      // Attach user to request
      request.user = user;
      return true;
    } catch (error) {
      throw error;
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}

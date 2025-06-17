import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { FirebaseAuthGuard } from "src/auth/guards/firebase-auth.guard";
// import { FirebaseAuthGuard } from "src/auth/jwt/firebase-auth-guard-DEPRECATED";
import { UserService } from "src/user/user.service";

@Injectable()
export class DefaultAuthGuard extends FirebaseAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService) protected readonly users: UserService,
    protected readonly config: ConfigService
  ) {
    super();
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<any> {
    return true;
    // const request = context.switchToHttp().getRequest<Request>();

    // const isLocked = this.reflector.get<boolean>(IS_LOCKED_KEY, context.getHandler());

    // if (isLocked) {
    //   const accessToken = request.headers["access_token"];
    //   if (accessToken !== this.config.get("ACCESS_TOKEN")) {
    //     return false;
    //   }
    // }

    // const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    // if (isPublic) {
    //   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    //   if (!token) {
    //     return true;
    //   }

    //   return getAuth()
    //     .verifyIdToken(token)
    //     .then(async ({ uid }) => !!(request.user = await this.users.getUser(uid)));
    // }

    // return super.canActivate(context);
  }
}

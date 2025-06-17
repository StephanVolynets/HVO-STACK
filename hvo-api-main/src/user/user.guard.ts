import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "./user.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(@Inject(UserService) protected readonly users: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    // const request = context.switchToHttp().getRequest<Request>();
    // const userId = request.params.id;
    // const uid = request.user?.id;

    // const handler = context.getHandler().name;

    // const info = context.switchToHttp().getRequest().params;

    // // TODO: Implement the logic for the UserGuard
    // if (handler === "getUsers" || handler === "rateUser" || handler === "getUserRatings") {
    //   return true;
    // }

    // if (handler === "updateVerificationStatus") {
    //   return true;
    // }

    // if (handler === "getPublicUser" || userId === uid) {
    //   return true;
    // }

    // if (handler === "reportUser" && uid) {
    //   return true;
    // }

    // return false;
  }
}

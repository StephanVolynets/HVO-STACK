import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
// import { RequestUser } from 'src/@types/auth';

// export const User = createParamDecorator(
//   (data: keyof RequestUser | Array<keyof RequestUser>, ctx: ExecutionContext) => {
//     const request: Request = ctx.switchToHttp().getRequest();
//     const user = request.user;
//     return data ? (typeof data === "object" ? data.map((key) => user?.[key]) : user?.[data]) : user;
//   }
// );

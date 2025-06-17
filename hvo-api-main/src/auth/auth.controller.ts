import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "./auth.service";

@Public()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Post("validate-jwt")
  async validateJWTAndGenerateFirebaseToken(@Body("token") token: string): Promise<{ firebaseToken: string }> {
    const firebaseToken = await this.authService.validateJWTAndGenerateFirebaseToken(token);
    return { firebaseToken };
  }

  @Post("test-login")
  async TESTGenerateStaffTaskLink(@Body("userId") userId: number): Promise<{ link: string }> {
    // Generate a JWT for the given user
    const jwtToken = await this.authService.getOrCreateJWT(+userId);

    // Create the task link (hardcoded taskId for test purposes, replace as needed)
    const staffTaskLink = `${process.env.STAFF_CLIENT_URL}/dashboard/staff/tasks?taskId=872&token=${jwtToken}`;

    return { link: staffTaskLink };
  }

  // @Public()
  // @Post('register')
  // async register(@Body() body: RegisteRequestDto) {
  //   return await this.service.register(body);
  // }
}

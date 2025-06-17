// src/auth/strategies/firebase.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    try {
      // Verify the token with Firebase Admin
      const decodedToken = await getAuth().verifyIdToken(token, true);
      
      // Get the user from your database
      const user = await this.userService.getUser(decodedToken.uid);
      
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      
      // Return the user which will be attached to request.user
      return user;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
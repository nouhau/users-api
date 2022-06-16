import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from './model/authRequest.model';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ){}

  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() request: any) {
    const data = request as AuthRequest
    return this.authService.getToken(data.user)
  }
}

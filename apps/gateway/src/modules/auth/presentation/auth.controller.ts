import type { ApiResponse } from '@fx-settlement-engine/types';
import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(): Promise<ApiResponse> {
    await this.authService.login();
    return {
      success: true,
      message: 'OK',
    };
  }
}

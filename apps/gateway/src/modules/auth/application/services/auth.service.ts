import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async login(): Promise<void> {
    // Implement login logic here
  }
}

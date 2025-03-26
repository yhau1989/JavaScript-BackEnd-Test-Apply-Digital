import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User credentials for login',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: "User's username" },
        password: { type: 'string', description: "User's password" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}

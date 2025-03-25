import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return access token for valid credentials', () => {
    const result = service.login('guest', 'guest_password');
    expect(result).toEqual({ access_token: 'mocked_token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'guest', sub: 'guest_id' });
  });

  it('should throw an error for invalid credentials', () => {
    expect(() => service.login('invalid_user', 'invalid_password')).toThrow(HttpException);
    expect(() => service.login('invalid_user', 'invalid_password')).toThrowError(
      new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
    );
  });
});

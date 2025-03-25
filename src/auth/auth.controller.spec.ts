import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ token: 'test-token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto = { username: 'testuser', password: 'testpass' };
      await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should return a token', async () => {
      const loginDto = { username: 'testuser', password: 'testpass' };
      const result = await authController.login(loginDto);
      expect(result).toEqual({ token: 'test-token' });
    });
  });
});

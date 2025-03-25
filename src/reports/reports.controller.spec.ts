import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  let reportsService: ReportsService;

  beforeEach(async () => {
    const mockReportsService = {
      getDeletedPercentage: jest.fn().mockReturnValue({ percentage: 40 }),
      getNonDeletedPercentage: jest.fn().mockReturnValue({ percentage: 60 }),
      getCustomReport: jest.fn().mockReturnValue({ report: 'Custom Data' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => true),
      })
      .compile();

    reportsController = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(reportsController).toBeDefined();
  });

  it('should return deleted percentage', async () => {
    expect(await reportsController.getDeletedPercentage()).toEqual({ percentage: 40 });
    expect(reportsService.getDeletedPercentage).toHaveBeenCalled();
  });

  it('should return non-deleted percentage', async () => {
    expect(await reportsController.getNonDeletedPercentage(true, '2024-01-01', '2024-12-31')).toEqual({
      percentage: 60,
    });
    expect(reportsService.getNonDeletedPercentage).toHaveBeenCalledWith(true, '2024-01-01', '2024-12-31');
  });

  it('should return custom report', async () => {
    expect(await reportsController.getCustomReport()).toEqual({ report: 'Custom Data' });
    expect(reportsService.getCustomReport).toHaveBeenCalled();
  });
});

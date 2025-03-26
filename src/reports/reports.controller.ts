import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  @ApiOperation({ summary: 'Get percentage of deleted reports' })
  @ApiResponse({
    status: 200,
    description: 'The percentage of deleted reports',
    type: Number,
  })
  getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('non-deleted-percentage')
  @ApiOperation({ summary: 'Get percentage of non-deleted reports' })
  @ApiQuery({
    name: 'withPrice',
    required: false,
    type: Boolean,
    description: 'Filter reports based on price inclusion',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for filtering reports',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for filtering reports',
  })
  @ApiResponse({
    status: 200,
    description: 'The percentage of non-deleted reports',
    type: Number,
  })
  getNonDeletedPercentage(
    @Query('withPrice') withPrice?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.reportsService.getNonDeletedPercentage(withPrice, startDate, endDate);
  }

  @Get('custom-report')
  @ApiOperation({ summary: 'Get custom report' })
  @ApiResponse({
    status: 200,
    description: 'A custom report with dynamic data',
    type: Object,
  })
  getCustomReport() {
    return this.reportsService.getCustomReport();
  }
}

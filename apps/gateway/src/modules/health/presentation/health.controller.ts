import { Controller, Get, Headers } from '@nestjs/common';
import type { ApiResponse } from '@fx-settlement-engine/types';

type HealthCheckResponseMeta = {
  timestamp: string;
  requestId: string;
};

@Controller('health')
export class HealthController {
  @Get('/check')
  getHealth(
    @Headers('x-request-id') requestId: string,
  ): ApiResponse<HealthCheckResponseMeta> {
    return {
      success: true,
      message: 'OK',
      data: {
        timestamp: new Date().toISOString(),
        requestId: requestId,
      },
    };
  }
}

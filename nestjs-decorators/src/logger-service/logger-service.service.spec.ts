import { Test, TestingModule } from '@nestjs/testing';
import { LoggerServiceService } from './logger-service.service';

describe('LoggerServiceService', () => {
  let service: LoggerServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerServiceService],
    }).compile();

    service = module.get<LoggerServiceService>(LoggerServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

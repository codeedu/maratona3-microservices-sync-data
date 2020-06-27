import { Test, TestingModule } from '@nestjs/testing';
import { LogHttpService } from './log-http.service';

describe('LogHttpService', () => {
  let service: LogHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogHttpService],
    }).compile();

    service = module.get<LogHttpService>(LogHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

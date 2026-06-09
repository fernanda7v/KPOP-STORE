import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessEvent, AccessLog } from './entities/access-log.entity';

interface RequestInfo {
  ip?: string;
  headers?: {
    [key: string]: string | string[] | undefined;
  };
}

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private readonly accessLogsRepository: Repository<AccessLog>,
  ) {}

  private getIp(request: RequestInfo): string {
    const forwardedFor = request.headers?.['x-forwarded-for'];

    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0] ?? 'unknown';
    }

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip ?? 'unknown';
  }

  private getBrowser(request: RequestInfo): string {
    const userAgent = request.headers?.['user-agent'];

    if (Array.isArray(userAgent)) {
      return userAgent[0] ?? 'unknown';
    }

    return userAgent ?? 'unknown';
  }

  async registerAccess(userId: number, event: AccessEvent, request: RequestInfo) {
    const accessLog = this.accessLogsRepository.create({
      userId,
      event,
      ip: this.getIp(request),
      browser: this.getBrowser(request),
    });

    return this.accessLogsRepository.save(accessLog);
  }

  async findAll() {
    return this.accessLogsRepository.find({
      relations: {
        user: true,
      },
      order: { id: 'DESC' },
    });
  }
}
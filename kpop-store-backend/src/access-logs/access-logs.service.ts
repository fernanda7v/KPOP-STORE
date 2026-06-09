import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from './entities/access-log.entity';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private readonly accessLogRepository: Repository<AccessLog>,
  ) {}

  create(data: any) {
    const log = this.accessLogRepository.create(data);
    return this.accessLogRepository.save(log);
  }

  async registerAccess(...args: any[]) {
    const user = args[0];
    const event = args[1];

    const request = args.find(
      (arg) => arg && typeof arg === 'object' && (arg.headers || arg.ip),
    );

    const ipFromArgs = typeof args[2] === 'string' ? args[2] : undefined;
    const browserFromArgs = typeof args[3] === 'string' ? args[3] : undefined;

    const forwardedFor = request?.headers?.['x-forwarded-for'];
    const ip =
      ipFromArgs ||
      (Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor?.split(',')[0]) ||
      request?.ip ||
      request?.socket?.remoteAddress ||
      'No registrada';

    const browser =
      browserFromArgs ||
      request?.headers?.['user-agent'] ||
      'No registrado';

    return this.create({
      user: user?.id ? { id: user.id } : user,
      event,
      ip,
      browser,
    });
  }

  async findAll() {
    const logs = await this.accessLogRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 100,
    });

    return logs.map((log) => ({
      id: log.id,
      event: log.event,
      ip: log.ip,
      browser: log.browser,
      createdAt: log.createdAt,
      user: log.user
        ? {
            id: log.user.id,
            name: log.user.name,
            email: log.user.email,
          }
        : null,
    }));
  }
}
import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmServerService {
  getHello(): string {
    return 'Hello World!';
  }
}

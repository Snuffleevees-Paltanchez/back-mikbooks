import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  getAuthorizedContent(): string {
    return 'You are authorized to view this content!'
  }
}

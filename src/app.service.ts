import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Cors :( !'
  }

  getProtectedContent(): { message: string } {
    return { message: 'This is protected content!' }
  }

  getAdminContent(): { message: string } {
    return { message: 'This is admin content!' }
  }
}

import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Cors :( !'
  }

  getProtectedContent(): string {
    return 'This is protected content!'
  }

  getAdminMessage = (): string => {
    return 'This is an admin message!'
  }
}

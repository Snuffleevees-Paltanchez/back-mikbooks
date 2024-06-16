import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { expressJwtSecret } from 'jwks-rsa'
import { promisify } from 'util'
import * as jwt from 'express-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthGuard implements CanActivate {
  private AUTH0_DOMAIN: string
  private AUTH0_AUDIENCE: string

  constructor(private configService: ConfigService) {
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') as string
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') as string
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getArgByIndex(0)
    const response = context.getArgByIndex(1)
    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${this.AUTH0_DOMAIN}/.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    )
    try {
      await checkJwt(request, response)
      return true
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }
}

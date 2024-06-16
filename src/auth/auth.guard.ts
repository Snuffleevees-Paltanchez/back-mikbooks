import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GetVerificationKey, expressjwt } from 'express-jwt'
import { expressJwtSecret } from 'jwks-rsa'
import { promisify } from 'util'
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
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as GetVerificationKey,
        issuer: this.AUTH0_DOMAIN,
        audience: this.AUTH0_AUDIENCE,
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

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

function checkEnvironment(configService: ConfigService) {
  const requiredEnvVars = ['DATABASE_URL', 'ISSUER_BASE_URL', 'AUDIENCE']

  requiredEnvVars.forEach((envVar) => {
    if (!configService.get<string>(envVar)) {
      throw Error(`Undefined environment variable: ${envVar}`)
    }
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService>(ConfigService)
  checkEnvironment(configService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000)
}
bootstrap()

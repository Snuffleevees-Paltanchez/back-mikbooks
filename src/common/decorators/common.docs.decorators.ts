import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

interface ApiEndpointOptions {
  info: { notFound?: string; summary: string }
  type: any
  auth?: boolean
}

export function ApiEndpoint({ info, type, auth = false }: ApiEndpointOptions) {
  const decorators = [
    ApiOperation({ summary: info.summary }),
    ApiResponse({
      status: 200,
      description: `${info.summary} successfully`,
      type: type,
    }),
  ]

  if (info.notFound) {
    decorators.push(
      ApiResponse({ status: 404, description: `${info.notFound} not found` }),
    )
  }

  if (auth) {
    decorators.push(ApiBearerAuth())
  }

  return applyDecorators(...decorators)
}

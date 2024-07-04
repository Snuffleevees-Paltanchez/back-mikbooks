import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

interface ApiEndpointOptions {
  summary: string
  notFound?: string
  type: any
  auth?: boolean
}

export function ApiEndpoint({
  summary,
  notFound,
  type,
  auth = false,
}: ApiEndpointOptions) {
  const decorators = [
    ApiOperation({ summary: summary }),
    ApiResponse({
      status: 200,
      description: `${summary} successfully`,
      type: type,
    }),
  ]

  if (notFound) {
    decorators.push(ApiResponse({ status: 404, description: `${notFound} not found` }))
  }

  if (auth) {
    decorators.push(ApiBearerAuth())
  }

  return applyDecorators(...decorators)
}

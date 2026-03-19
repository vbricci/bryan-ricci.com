import { ISession } from '@vrobots/user'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import axios, { AxiosInstance } from 'axios'

import 'server-only'

export const createRequestClient = (userAgent: string, ip: string, session?: ISession): AxiosInstance => {
  const authorizationHeader = session ? `Bearer ${session.token}` : ''

  return axios.create({
    headers: {
      'User-Agent': userAgent,
      'X-Forwarded-For': ip,
      ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
    },
  })
}

export default async function getSession(): Promise<ISession | undefined> {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  // Check x-forwarded-for first, and take the first IP in the list
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp ?? 'Unknown'

  const client = createRequestClient(userAgent, ip)

  const session = await client.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user/session`)

  if (!session.status || session.status !== 200) {
    notFound()
  }

  return session.data
}
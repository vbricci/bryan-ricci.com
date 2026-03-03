import { ISession } from '@/types'
import 'server-only'

export default async function getSession(apiHost: string): Promise<ISession | undefined> {
  
  const session = await fetch(apiHost + '/api/v1/user/session', {
    method: 'GET',
  })

  return session.json()
}
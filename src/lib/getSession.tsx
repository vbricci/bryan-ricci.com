import { ISession } from '@/types'
import 'server-only'

export default async function getSession(host?: string): Promise<ISession | undefined> {
  
  if (!host) {
    return void 0
  }
  
  const session = await fetch(process.env.API_HOST + '/api/v1/user/session', {
    method: 'GET',
  })

  return session.json()
}
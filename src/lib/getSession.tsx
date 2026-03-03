import { ISession } from '@/types'
// import { notFound } from 'next/navigation'

import 'server-only'

export default async function getSession(apiHost: string): Promise<ISession | undefined> {
  
  const session = await fetch(apiHost + '/api/v1/user/session', {
    method: 'GET',
  })

  // if (!session.ok) {
  //   notFound()
  // }

  return session.json()
}
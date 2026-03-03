import { ISession } from '@/types'
import { notFound } from 'next/navigation'

import 'server-only'

export default async function getSession(): Promise<ISession | undefined> {
  
  const session = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/api/v1/user/session', {
    method: 'GET',
  })

  if (!session.ok) {
    notFound()
  }

  return session.json()
}
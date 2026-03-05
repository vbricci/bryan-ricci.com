import { ISession } from '@/types'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import axios from 'axios';

import 'server-only'

const createAxiosHeaders = (userAgent: string, session?: ISession) => {
  axios.interceptors.request.use((request) => {
    const authorizationHeader = session ? `Bearer ${session._id}` : ''
    request.headers['User-Agent'] = userAgent
    request.headers['Authorization'] = authorizationHeader
    return request
  }, function (error) {
    return Promise.reject(error);
  });
}

export default async function getSession(): Promise<ISession | undefined> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  console.log('User-Agent in getSession:', userAgent);
  const session = await axios.get(process.env.NEXT_PUBLIC_API_HOST + '/api/v1/user/session', {
    method: 'GET',
    headers: {
      'User-Agent': userAgent || '',
    }
  })

  if (!session.status || session.status !== 200) {
    notFound()
  }

  createAxiosHeaders(userAgent || '', session.data)

  return session.data
}
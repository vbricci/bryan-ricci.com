import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
 
const proxy = (request: NextRequest) => {
  console.log('Proxying request to API:', request.url)
  const url = request.nextUrl.clone()
  return NextResponse.rewrite(url)
}

export default proxy
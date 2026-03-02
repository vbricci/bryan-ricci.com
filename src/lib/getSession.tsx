import 'server-only'

export default async function getSession() {
  const session = await fetch('http://localhost:8000/api/v1/user/session', {
    method: 'GET',
  })

  return session.json()
}
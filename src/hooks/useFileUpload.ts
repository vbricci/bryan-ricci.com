
import { useSession } from '@/app/session/SessionProvider'
import { IFile } from '@vrobots/file'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

const useFileUpload = () => {
  const { session: { token }} = useSession()
  const router = useRouter()
  return {
    upload: useCallback(
      (file: File, callbackPercentage?: (percent: number) => void) => new Promise((resolve, reject) => {
        const data = new FormData()
        const request = new XMLHttpRequest()

        console.log('Uploading file:', file)
      
        data.append('file', file)
      
        request.addEventListener('load', () => {
          if (request.status === 200) {
            resolve(request.response as IFile)
          } else if (request.status === 401) {
            router.push('/unauthorized')
          } else {
            reject(request.response)
          }
        })
      
        request.upload.addEventListener('progress', e => {
          if (callbackPercentage) {
            const percentComplete = Math.floor((e.loaded / e.total) * 100)
            callbackPercentage(percentComplete)
          }
        })
      
        request.responseType = 'json'
        request.open('post', process.env.NEXT_PUBLIC_API_HOST_FILE + `/api/v1/file/upload`) 
        request.setRequestHeader('Authorization', `Bearer ${token}`)
        request.send(data)
      }), 
      [token]
    ),
    uploadDraft: useCallback(
      (file: File): Promise<object> => new Promise((resolve, reject) => {
        const data = new FormData()
        const request = new XMLHttpRequest()
      
        data.append('file', file)
      
        request.addEventListener('load', () => {
          if (request.status === 200) {
            resolve({ data: { link: `${process.env.NEXT_PUBLIC_API_HOST_FILE}/api/v1/file/stream/${request.response}`}})
          } else {
            reject(request.response)
          }
        })
      
        request.responseType = 'json'
        request.open('post', process.env.NEXT_PUBLIC_API_HOST_FILE + `/api/v1/file/upload`) 
        request.setRequestHeader('Authorization', token)
        request.send(data)
      }), 
      [token]
    ),
  }
}
export default useFileUpload
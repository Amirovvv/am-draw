export interface Drawing {
  id: string
  url: string
  aiUrl: string | undefined
  aiStatus: 'pending' | 'processing' | 'done' | 'error'
  author: string
  photoURL: string
  date: string
}

import { useAuthStore } from '@/store/auth'
import { useGalleryStore } from '@/store/gallery'
import { firestore } from '@/services/firebaseConfig'
import { supabase } from '@/services/supabase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { timeAgo } from '@/utils/timeAgo'
import type { Drawing } from '@/types/Drawing'

export function useGallery() {
  const authStore = useAuthStore()
  const { setDrawings } = useGalleryStore()

  const drawingsCollection = collection(firestore, 'drawings')
  const sortedQuery = query(drawingsCollection, orderBy('date', 'desc'))

  const handleFirestoreError = (error: unknown) => {
    console.error(error)
  }

  const fetchDrawings = () => {
    onSnapshot(
      sortedQuery,
      (snapshot) => {
        try {
          const res: Drawing[] = snapshot.docs.map((doc) => {
            const data = doc.data()
            const timestamp =
              typeof data.date === 'number' ? data.date : Date.now()
            return {
              id: doc.id,
              url: (data.url as string) || '',
              author: (data.author as string) || 'Unknown Author',
              photoURL: (data.photoURL as string) || '',
              date: timeAgo(timestamp),
            }
          })
          setDrawings(res)
        } catch (error) {
          handleFirestoreError(error)
        }
      },
      (error) => {
        handleFirestoreError(error)
      }
    )
  }

  const addDrawing = async (
    canvas: HTMLCanvasElement
  ): Promise<{ success: boolean; error?: string }> => {
    const currentUserValue = (authStore.user as any)?.value ?? authStore.user
    if (!currentUserValue) {
      const error = 'Пользователь не авторизован.'
      console.error('User not authenticated:', { user: currentUserValue })
      handleFirestoreError(error)
      return { success: false, error }
    }

    const displayName =
      (currentUserValue as any)?.displayName || 'Unknown Author'
    const photoURL = (currentUserValue as any)?.photoURL || ''

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/webp', 0.8)
      )
      if (!blob) {
        const error = 'Не удалось создать Blob из canvas'
        handleFirestoreError(error)
        return { success: false, error }
      }

      const fileName = `drawing_${Date.now()}.webp`

      const { error: uploadError } = await supabase.storage
        .from('drawings')
        .upload(fileName, blob, { upsert: true })

      if (uploadError) {
        const errorMessage = `Ошибка загрузки: ${uploadError.message}`
        handleFirestoreError(uploadError)
        return { success: false, error: errorMessage }
      }

      const { data } = supabase.storage.from('drawings').getPublicUrl(fileName)

      if (!data?.publicUrl) {
        const error = 'Не удалось получить publicUrl.'
        handleFirestoreError(error)
        return { success: false, error }
      }

      const publicUrl = data.publicUrl

      await addDoc(drawingsCollection, {
        url: publicUrl,
        date: Date.now(),
        author: displayName,
        photoURL: photoURL,
      })

      return { success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при сохранении рисунка'
      handleFirestoreError(error)
      return { success: false, error: errorMessage }
    }
  }

  return {
    fetchDrawings,
    addDrawing,
  }
}

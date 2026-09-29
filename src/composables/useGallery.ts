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

  const fetchDrawings = () => {
    onSnapshot(sortedQuery, (snapshot) => {
      const res = snapshot.docs.map((doc) => {
        const data = doc.data()
        const timestamp = typeof data.date === 'number' ? data.date : Date.now()

        return {
          id: doc.id,
          url: data.url || '',
          aiUrl: data.aiUrl || null,
          aiStatus: data.aiStatus || 'pending',
          author: data.author || 'Unknown',
          photoURL: data.photoURL || '',
          date: timeAgo(timestamp),
        }
      })

      setDrawings(res)
    })
  }

  const addDrawing = async (canvas: HTMLCanvasElement) => {
    const user = (authStore.user as any)?.value ?? authStore.user
    if (!user) return { success: false, error: 'Пользователь не авторизован.' }

    const displayName = user.displayName || 'Unknown Author'
    const photoURL = user.photoURL || ''

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.8)
    )

    if (!blob) return { success: false, error: 'Не удалось создать Blob' }

    const fileName = `drawing_${Date.now()}.webp`
    await supabase.storage
      .from('drawings')
      .upload(fileName, blob, { upsert: true })
    const { data } = supabase.storage.from('drawings').getPublicUrl(fileName)

    if (!data?.publicUrl) return { success: false, error: 'Нет publicUrl' }

    const docRef = await addDoc(drawingsCollection, {
      url: data.publicUrl,
      date: Date.now(),
      author: displayName,
      photoURL,
      aiStatus: 'pending',
      aiUrl: null,
    })

    // 👉 Запускаем генерацию
    fetch('/.netlify/functions/startGeneration', {
      method: 'POST',
      body: JSON.stringify({
        drawingId: docRef.id,
        imageUrl: data.publicUrl,
      }),
    }).catch(console.error)

    return { success: true }
  }

  return {
    fetchDrawings,
    addDrawing,
  }
}

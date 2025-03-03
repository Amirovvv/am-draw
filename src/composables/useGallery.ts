import { useAuthStore } from '@/store/auth'
import { useGalleryStore } from '@/store/gallery'
import { firestore } from '@/services/firebaseConfig'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { timeAgo } from '@/utils/timeAgo'

export function useGallery() {
  const { user } = useAuthStore()
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
          const res = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: timeAgo(doc.data().date),
          }))
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

  const addDrawing = async (drawingUrl: string) => {
    if (!user) return
    try {
      await addDoc(drawingsCollection, {
        url: drawingUrl,
        date: Date.now(),
        author: user.displayName || 'Unknown Author',
        photoURL: user.photoURL,
      })
    } catch (error) {
      handleFirestoreError(error)
    }
  }

  return {
    fetchDrawings,
    addDrawing,
  }
}

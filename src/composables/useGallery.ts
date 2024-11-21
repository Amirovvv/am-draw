import { useAuthStore } from '@/store/auth'
import { useGalleryStore } from '@/store/gallery'
import { firestore } from '@/services/firebaseConfig'
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore'
import { ref } from 'vue'

export function useGallery() {
  const liked = ref()
  const { user } = useAuthStore()
  const { setDrawings } = useGalleryStore()

  const fetchDrawings = () => {
    const drawingsCollection = collection(firestore, 'drawings')
    onSnapshot(
      drawingsCollection,
      (snapshot) => {
        try {
          const res = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as any
          setDrawings(res)
        } catch (error) {
          console.error('Error fetching drawings: ', error)
        }
      },
      (error) => {
        console.error('Error with onSnapshot: ', error)
      }
    )
  }

  const addDrawing = async (drawingUrl: string) => {
    if (!user) return

    try {
      await addDoc(collection(firestore, 'drawings'), {
        url: drawingUrl,
        date: Date.now(),
        author: user.displayName || 'Unknown Author',
        likes: 0,
      })
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return {
    fetchDrawings,
    addDrawing,
  }
}

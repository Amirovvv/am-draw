import { useAuthStore } from '@/store/auth'
import { useGalleryStore } from '@/store/gallery'
import { firestore } from '@/services/firebaseConfig'
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  orderBy,
} from 'firebase/firestore'
import { timeAgo } from '@/utils/timeAgo'
import { useRouter } from 'vue-router'

export function useGallery() {
  const { user } = useAuthStore()
  const { setDrawings } = useGalleryStore()
  const router = useRouter()

  const drawingsCollection = collection(firestore, 'drawings')
  const sortedQuery = query(drawingsCollection, orderBy('date', 'desc'))

  const handleFirestoreError = (error) => {
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
          handleFirestoreError(error, 'fetchDrawings')
        }
      },
      (error) => {
        handleFirestoreError(error, 'onSnapshot')
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
        likes: 0,
        likedBy: [],
      })
    } catch (error) {
      handleFirestoreError(error, 'addDrawing')
    }
  }

  const toggleLike = async (drawingId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    const userId = user.uid
    const drawingRef = doc(firestore, 'drawings', drawingId)

    const { drawings } = useGalleryStore()
    const drawing = drawings.find((d) => d.id === drawingId)
    if (!drawing) return

    const hasLiked = drawing.likedBy.includes(userId)
    const newLikes = hasLiked ? drawing.likes - 1 : drawing.likes + 1
    const newLikedBy = hasLiked
      ? drawing.likedBy.filter((id) => id !== userId)
      : [...drawing.likedBy, userId]

    drawing.likes = newLikes
    drawing.likedBy = newLikedBy

    try {
      await updateDoc(drawingRef, {
        likes: newLikes,
        likedBy: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
      })
    } catch (error) {
      handleFirestoreError(error, 'toggleLike')

      drawing.likes = hasLiked ? newLikes + 1 : newLikes - 1
      drawing.likedBy = hasLiked
        ? [...newLikedBy, userId]
        : newLikedBy.filter((id) => id !== userId)
    }
  }

  const isLiked = (drawing: any) => {
    if (!user) return false
    return drawing.likedBy.includes(user.uid)
  }

  return {
    fetchDrawings,
    addDrawing,
    toggleLike,
    isLiked,
  }
}

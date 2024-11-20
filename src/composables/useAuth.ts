import { useRouter } from 'vue-router'
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from 'firebase/auth'
import { useAuthStore } from '@/store/auth'
import { auth } from '@/services/firebaseConfig'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    authStore.isLoading = true
    try {
      const result = await signInWithPopup(auth, provider)
      authStore.setUser(result.user)
      router.push('/draw')
    } catch (err) {
      console.log('error', err)
    } finally {
      authStore.isLoading = false
    }
  }

  const loginWithGitHub = async () => {
    const provider = new GithubAuthProvider()
    authStore.isLoading = true
    try {
      const result = await signInWithPopup(auth, provider)
      authStore.setUser(result.user)
      router.push('/draw')
    } catch (err) {
      console.log('error', err)
    } finally {
      authStore.isLoading = false
    }
  }

  const logout = async () => {
    await signOut(auth)
    authStore.clearUser()
    router.push('/')
  }

  const checkAuthState = () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          authStore.setUser(user)
        } else {
          authStore.clearUser()
        }
        resolve()
      })
    })
  }

  return {
    loginWithGoogle,
    loginWithGitHub,
    logout,
    checkAuthState,
  }
}

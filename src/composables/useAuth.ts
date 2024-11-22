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
      localStorage.setItem('user', JSON.stringify(result.user))
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
      localStorage.setItem('user', JSON.stringify(result.user))
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
    localStorage.removeItem('user')
    router.push('/')
  }

  const checkAuthState = () => {
    return new Promise<void>((resolve) => {
      const cachedUser = localStorage.getItem('user')
      if (cachedUser) {
        authStore.setUser(JSON.parse(cachedUser))
        resolve()
      } else {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            authStore.setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
          } else {
            authStore.clearUser()
            localStorage.removeItem('user')
          }
          resolve()
        })
      }
    })
  }

  return {
    loginWithGoogle,
    loginWithGitHub,
    logout,
    checkAuthState,
  }
}

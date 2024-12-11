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

  const loginWithProvider = async (
    provider: GoogleAuthProvider | GithubAuthProvider
  ) => {
    authStore.isLoading = true
    try {
      const result = await signInWithPopup(auth, provider)
      authStore.setUser(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))
      router.push('/draw')
    } catch (err) {
      console.error('Login error', err)
    } finally {
      authStore.isLoading = false
    }
  }

  const loginWithGoogle = () => loginWithProvider(new GoogleAuthProvider())
  const loginWithGitHub = () => loginWithProvider(new GithubAuthProvider())

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

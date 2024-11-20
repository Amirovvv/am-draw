import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  const setUser = (newUser: any) => {
    user.value = newUser
  }

  const clearUser = () => {
    user.value = null
  }

  return {
    user,
    isLoading,
    setUser,
    clearUser,
  }
})

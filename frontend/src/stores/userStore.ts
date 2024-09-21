import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // Inicializar os dados do usuário e JWT a partir do localStorage
  const user = ref<User>({
    id: Number(localStorage.getItem('id')),
    username: localStorage.getItem('username') || "",
    email: localStorage.getItem('email') || "",
    role: {
      name: localStorage.getItem('role') || ""
    }
  })
  
  // Inicializar o JWT a partir do localStorage
  const jwt = ref(localStorage.getItem('jwt') || '')

  const role = computed(() => user.value.role.name)
  const username = computed(() => user.value.username)
  const isAuthenticated = computed(() => jwt.value !== "")

  // Função para salvar os dados no localStorage ao autenticar
  function authenticaded(authUser: User, token: string) {
    user.value = authUser
    jwt.value = token

    // Persistir os dados do usuário e o JWT no localStorage
    localStorage.setItem('username', authUser.username)
    localStorage.setItem('id', authUser.id.toString())
    localStorage.setItem('email', authUser.email)
    localStorage.setItem('role', authUser.role.name)
    localStorage.setItem('jwt', token) // Salvar o token JWT
  }

  // Função para realizar o logout e limpar o localStorage
  function logout() {
    jwt.value = ""
    user.value = {} as User
    localStorage.clear() // Limpar todos os dados armazenados no localStorage
  }

  return { user, username, jwt, role, isAuthenticated, authenticaded, logout }
})



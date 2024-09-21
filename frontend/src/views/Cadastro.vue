<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import type { ApplicationError } from '@/types'
import { useUserStore } from '@/stores/userStore'

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()

async function register() {
  try {
    loading.value = true
    exception.value = undefined

    const { data } = await api.post('/auth/local/register', {
        username: username.value,
        email: email.value,
        password: password.value
    })
    router.push('/login') 
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <div class="row justify-content-center">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Cadastro</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="register">
            <div class="mb-3">
            <label for="usernameInput" class="form-label">Username:</label>
            <input
              type="username"
              class="form-control"
              id="usernameInput"
              v-model="username"
              required
            />
            <div class="invalid-feedback">Você deve informar um email válido.</div>
          </div>
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="emailInput"
              placeholder="mail@mail.com"
              v-model="email"
              required
            />
            <div class="invalid-feedback">Você deve informar um email válido.</div>
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input
              type="password"
              class="form-control"
              id="passwordInput"
              v-model="password"
              required
            />
            <div class="invalid-feedback">A senha é um campo obrigatório.</div>
          </div>
          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Cadastrar" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
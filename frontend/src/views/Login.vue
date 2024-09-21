<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import type { ApplicationError } from '@/types'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()

const userStore = useUserStore()

async function authenticate() {
  try {
    loading.value = true
    exception.value = undefined
    const { data } = await api.post('/auth/local', {
      identifier: identifier.value,
      password: password.value
    })
    const { jwt } = data

    const res = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      params: {
        populate: 'role'
      }
    })

    const role = res.data.role.type

    userStore.authenticaded(res.data, jwt)

    

    if (role == 'organizador') {
      router.push('/admin')
    } else {
      router.push('/')
    }
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
        <h5 class="card-title">Sign in</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="authenticate">
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="emailInput"
              placeholder="mail@mail.com"
              v-model="identifier"
              required
            />
            <div class="invalid-feedback">Você deve informar um email válido.</div>
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
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
            <input type="submit" class="float-end btn btn-primary" value="Enviar" />
          </div>
        </form>
      </div>
      <RouterLink to="/cadastro"><p class="card-text">Faça seu cadastro</p></RouterLink>
    </div>
  </div>
</template>


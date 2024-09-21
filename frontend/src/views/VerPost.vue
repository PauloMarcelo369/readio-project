
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { ApplicationError, Poste } from '@/types'
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';


import Post from '../components/Post.vue';

const exception = ref<ApplicationError>()
const userStore = useUserStore()
const loading = ref(true)
const error = ref<ApplicationError>()

const user_id = userStore.user.id
const router = useRouter()
const route = useRoute()
const post = ref({} as Poste)
const post_owner = ref(0)

//parei aqui, JA ESTA PEGANDO O POST
//preciso sinalizar qual o livro na pagina do post
//preciso botar botao de editar ou excluir post

async function getPost() {
  try {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro,users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    post.value = data.data
    console.log(post._rawValue)
    post_owner.value = post._rawValue.attributes.users_permissions_user.data.id
    console.log(post_owner._rawValue)
    console.log(user_id)
    if(post_owner._rawValue != user_id){
        console.log("NAO EH MEU POST")
    }
    console.log("a doidera dando certo")

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
}

async function apagarPost() {
    try {
    const { data } = await api.delete(`/posts/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
  router.push(`/livros/${post._rawValue.attributes.livro.data.id}`);
}
getPost()

</script>

<template>
    <div class="position-relative">
      <span class="badge text-bg-warning">Post sobre {{ post.attributes.livro.data.attributes.Nome }}</span>
      
      <!-- Post component -->
      <div class="post-content">
        <Post
          :key="post.id"
          :conteudo="post.attributes.Conteudo"
          :dado="post.attributes.Dado"
          :tipo="post.attributes.Tipo"
          :livro="post.attributes.livro"
          :user="post.attributes.users_permissions_user.data.attributes.username"
          :id="post.id"
        />
      </div>
      
      <!-- Ícones com v-if para mostrar apenas se o usuário for o dono do post -->
      <div v-if="post_owner == user_id" class="icon-container">
        <RouterLink :to="`/posts/editar/${post.id}`">
        <button class="btn btn-info" title="Editar Post">
          <i class="bi bi-pencil-square"></i>
        </button>
        </RouterLink>
        <button class="btn btn-danger" @click="apagarPost()" title="Apagar Post">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </template>

<style scoped>
.position-relative {
  position: relative;
}

.icon-container {
  position: absolute;
  top: 10px; 
  right: 10px; 
  display: flex;
  flex-direction: column;
}

.icon-container button {
  margin-bottom: 10px; 
}
</style>

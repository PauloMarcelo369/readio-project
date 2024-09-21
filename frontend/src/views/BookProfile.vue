<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '../stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import Post from '../components/Post.vue';


const posts = ref('')
const posts_selecionados = ref([])
const route = useRoute()
const livro = ref({} as Livro)
const loading = ref(true)
const error = ref<ApplicationError>()
const uploadHelper = useUpload()
const estante = ref({} as Estante)

const feedback = ref('')
const userStore = useUserStore()
const user_id = userStore.user.id

const isBookInEstante = ref(false)

async function getPosts() {
  try {
    const { data } = await api.get(`/posts?populate=livro,users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    posts.value = data.data
    //console.log(posts._rawValue)
    const posts_sel = ref([])

    for(let i = 0; i < posts._rawValue.length; i++){
        if(posts._rawValue[i].attributes.livro.data.id == livro._rawValue.id)
          posts_sel.value.push(posts._rawValue[i])
      
    }

    posts_selecionados.value = toRaw(posts_sel._rawValue)

    //console.log(posts_selecionados)

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
}

async function checkIfBookInEstante() {
  try {
    const { data } = await api.get(`/estantes/${user_id}?populate=livros.Capa`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
     getPosts()
    //console.log(data.data.attributes.livros.data);

    //console.log("data:");
    
    //console.log(data);
    
    estante.value = data.data.attributes.livros.data

    //console.log(estante);
    

    //const estante_objeto = toRaw(estante.value)
    //console.log(estante_objeto);
    

    // Verifica se o livro está na estante
    let found = false
    for (let i = 0; i < data.data.attributes.livros.data.length; i++) {
    
        if (data.data.attributes.livros.data[i].id == route.params.id) {
            found = true
            break
        }
    }

    isBookInEstante.value = found
  } catch (e) {
    console.error('Erro ao checar estante', e)
  }
}

async function toggleBookInEstante() {
  checkIfBookInEstante()
  const action = isBookInEstante.value ? 'remove' : 'add'

  try {
    loading.value = true
    
    //console.log(estante._rawValue);
    
    const currentLivros = toRaw(estante._rawValue)
    //console.log("currentLivros:");

    const currentLivros_id = []

    for (let i = 0; i < currentLivros.length; i++) {
      currentLivros_id.push(currentLivros[i].id)
    }
    //console.log(currentLivros_id)
    
    
    //console.log(currentLivros);
    //console.log("livro raw value");

    //console.log(livro._rawValue);
    
    const livro_objeto = toRaw(livro._rawValue)

    //console.log("livro_objeto");

    //console.log(livro_objeto);
    

    if (action == 'add') {
      //console.log("tentei add");
      currentLivros_id.push(livro_objeto.id)
    } else if (action == 'remove') {
      //console.log("tentei remover");
      let indexToRemove = -1; 
      for (let i = 0; i < currentLivros_id.length; i++) {
        if (currentLivros_id[i] === livro_objeto.id) {
          indexToRemove = i; 
          break;
        }
      }
      if (indexToRemove > -1) {
        currentLivros_id.splice(indexToRemove, 1);
      }
    }

    const newdata = {
      data: {
        livros: currentLivros_id
      }
    };

    console.log('Payload enviado:', newdata)
    

    const { data } = await api.put(`/estantes/${user_id}`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    checkIfBookInEstante()
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    } else {
      console.error('Erro inesperado:', e)
    }
  } finally {
    loading.value = false
  }
}

async function getLivro() {
  try {
    const { data } = await api.get(`/livros/${route.params.id}?populate=Capa`)
    livro.value = data.data
    //console.log("getlivro")
    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

getLivro()

if(userStore.user.role.name != 'Organizador'){
  checkIfBookInEstante()
}



</script>

<template>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error.error.message }}
    </div>
    
    <div v-if="loading" class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    
    <div v-else class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <!-- DANDO PROBLEMA -->
              <img
                v-if="livro.attributes.Capa" 
                :src="uploadHelper(livro.attributes.Capa.data.attributes.url)"
                class="w-100 rounded-start"
                :alt="livro.nome"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">{{ livro.attributes.Nome }}</h5>
                  <template v-if="userStore.user.role.name != 'Organizador'">
                    <button class="btn fs-1" @click="toggleBookInEstante">
                      <i v-if="isBookInEstante" class="bi bi-bookmark-check-fill"></i>
                      <i v-else class="bi bi-bookmark-plus"></i>
                    </button>
                  </template>
                </div>
                <hr />
                
                <div class="text-start">
                  <p class="card-text">Autor(a): {{ livro.attributes.Autor }}</p>
                  <p class="card-text">
                    <strong>
                      Gênero: <small class="text-danger">{{ livro.attributes.Genero }}</small>
                    </strong>
                  </p>
                  <p class="card-text">
                    Sinopse: {{ livro.attributes.Sinopse }}
                  </p>
                  <p class="card-text">
                    Nota: {{ livro.attributes.Nota }}/5
                  </p>
                  <p class="card-text">
                    Capítulos: {{ livro.attributes.nCapitulos }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
      <template v-if="userStore.user.role.name != 'Organizador'">
        <div v-for="posti in posts_selecionados">
          <RouterLink :to="`/post/${posti.id}`" class="text-decoration-none">
            <div>
              <Post
      
                :key="posti.id"
                :conteudo = "posti.attributes.Conteudo"
                :dado= "posti.attributes.Dado"
                :tipo= "posti.attributes.Tipo"
                :livro= "posti.attributes.livro"
                :user= "posti.attributes.users_permissions_user.data.attributes.username"
                :id= "posti.id"
              />
            </div>
          </RouterLink>
        </div>
    </template>
      
    </div>
  </template>
  
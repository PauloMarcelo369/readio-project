<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue';
import { isApplicationError } from '@/composables/useApplicationError';
import { isAxiosError } from 'axios'; // Certifique-se de ter axios importado
import type { ApplicationError, Estante, Livro } from '@/types';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';
import { useRouter, useRoute } from 'vue-router';



const estante = ref({} as Estante)
const estante_raw = ref({} as Estante)
const livros = ref([] as Livro[])
const livro_selecionado = ref({} as Livro);
const tipo = ref('');
const dado = ref(0);
const dado_edit = ref(0);
const edit = ref(false);

const route = useRoute()
const router = useRouter()
const conteudo = ref('');
const loading = ref(false);
const exception = ref<ApplicationError>()
const errorMessage = ref<string | null>(null);
const userStore = useUserStore()
const user_id = userStore.user.id
const user = userStore.user


    if (route.fullPath == `/posts/editar/${route.params.id}`){
        edit.value = true 
        console.log(edit.value)
    }


const getEstante = async () => {
  try {
        const { data } = await api.get(`/estantes/${user_id}?populate=livros.Capa,users_permissions_user`, {
        headers: {
                Authorization: `Bearer ${userStore.jwt}`,
            }
        });
        estante.value = data.data.attributes.livros.data
        //console.log(estante.value);
        estante_raw.value = toRaw(estante.value)
        //console.log(estante_raw._rawValue);

        for (let i = 0; i < estante_raw._rawValue.length; i++){
            livros.value.push(estante_raw._rawValue[i])   
        }

        //(livros._rawValue)
        if (data.data.length === 0) {
          throw new Error('Estante não encontrada para o usuário')
        }
      } catch (e) {
        if (isAxiosError(e) && isApplicationError(e.response?.data)) {
          exception.value = e.response?.data
        }
      } finally {
        loading.value = false
      }
    }

getEstante()

async function getLivro() {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro`, {
        headers: {
                Authorization: `Bearer ${userStore.jwt}`,
            }
    });
    livro_selecionado.value = data.data.attributes.livro
    console.log(livro_selecionado)
    tipo.value = data.data.attributes.Tipo
    console.log(data.data)
    dado_edit.value = data.data.attributes.Dado
    //for (let i = 0; i < livros.value.length; i++){
    // if(livros.value[i].id == )    
    //}
}

async function Postar() {
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 
    //console.log(livro_selecionado);

    if ((tipo.value == 'Nota') && (dado.value > 5 || dado.value < 1)) {
      errorMessage.value = "Postagem do tipo 'Nota' deve ter 'Dado' entre 1 e 5";
      throw new Error(errorMessage.value);
    }
    else if ((tipo.value == 'Progresso') && (dado.value > livro_selecionado._rawValue.attributes.nCapitulos || dado.value < 1)) {
      errorMessage.value = `Postagem do tipo 'Progresso' pro livro ${livro_selecionado._rawValue.attributes.Nome} deve ter 'Dado' entre 1 e ${livro_selecionado._rawValue.attributes.nCapitulos}`;
      throw new Error(errorMessage.value);
    }
    console.log("CREATE")


    //console.log(conteudo._rawValue);
    //console.log(livro_selecionado._rawValue.attributes.nCapitulos);
   // console.log(dado._rawValue);
    //console.log(tipo._rawValue);
    //console.log(livro_selecionado);
    //console.log(toRaw(user));
    //console.log(user_id);

    const newdata = {
      data: {
        Conteudo: conteudo._rawValue,
        Dado: dado._rawValue,
        Tipo: tipo._rawValue,
        livro: livro_selecionado._rawValue.id,
        users_permissions_user: user_id,
      }
    };

    //console.log('Payload enviado:', newdata)
    

    const { data } = await api.post(`/posts`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    router.push( { path: `/livros/${livro_selecionado._rawValue.id}`});

  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}

async function Editar() {
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 
    //console.log(livro_selecionado);
    await getLivro()
    if(tipo._rawValue == 'Nota'){
        console.log("dado inserido foi maior que 5")        
    }

    if ((tipo._rawValue == 'Nota') && (((dado_edit._rawValue > 5) || (dado_edit._rawValue < 1)) || ((dado._rawValue > 5) || (dado._rawValue < 1)) )) {
      errorMessage.value = "Postagem do tipo 'Nota' deve ter 'Dado' entre 1 e 5";
      throw new Error(errorMessage.value);
    }
    else if ((tipo.value == 'Progresso') && (dado.value > livro_selecionado._rawValue.attributes.nCapitulos || dado.value < 1)) {
      errorMessage.value = `Postagem do tipo 'Progresso' pro livro ${livro_selecionado._rawValue.attributes.Nome} deve ter 'Dado' entre 1 e ${livro_selecionado._rawValue.attributes.nCapitulos}`;
      throw new Error(errorMessage.value);
    }

    //console.log(conteudo._rawValue);
    //console.log(livro_selecionado._rawValue.attributes.nCapitulos);
   // console.log(dado._rawValue);
    //console.log(tipo._rawValue);
    //console.log(livro_selecionado);
    //console.log(toRaw(user));
    //console.log(user_id);

    const newdata = {
      data: {
        Conteudo: conteudo._rawValue,
        Dado: dado._rawValue,
      }
    };

    //console.log('Payload enviado:', newdata)
    

    const { data } = await api.put(`/posts/${route.params.id}`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log("UPDATE")

    router.push( { path: `/livros/${livro_selecionado._rawValue.data.id}`});

  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8 col-sm-12">
      <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">{{ edit ? 'Editar Postagem' : 'Nova Postagem' }}</h5>
          <form @submit.prevent=" edit? Editar(): Postar()">
            <div v-if="!edit" class="mb-3">
                <label for="livroInput" class="form-label">Selecione o livro da sua estante: </label>
                <select class="form-select form-select-sm" aria-label="Small select example" id="livroInput" v-model="livro_selecionado" required>
                <option v-for="livro in livros" :key="livro.attributes.Nome" :value="livro">
                    {{ livro.attributes.Nome }}
                </option>
            </select>
            </div>
            <div v-if="!edit" class="mb-3">
              <label for="tipoInput" class="form-label">Tipo de postagem: </label>
              <select class="form-select form-select-sm" aria-label="Small select example" id="tipoInput" v-model="tipo" required>
                <option value="Nota">Nota</option>
                <option value="Progresso">Progresso</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="dadoInput" class="form-label">Dado (Nota ou Capitulo Lido)</label>
              <input type="number" class="form-control" id="dadoInput" v-model="dado" required />
              <div v-if="errorMessage" class="invalid-feedback" style="display: block;">{{ errorMessage }}</div>
            </div>
            <div class="mb-3">
              <label for="conteudoInput" class="form-label">Conteúdo</label>
              <input type="text" class="form-control" id="conteudoInput" v-model="conteudo"/>
            </div>

            <div v-if="!edit" class="mb-3">
              <input type="submit" class="float-end btn btn-primary" value="Enviar" :disabled="loading" />
            </div>
            <div v-else>
             <input type="submit" class="float-end btn btn-primary" value="Editar" :disabled="loading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

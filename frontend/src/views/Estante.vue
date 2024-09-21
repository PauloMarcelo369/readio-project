<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ApplicationError, Estante } from "@/types";
import { api } from "@/api";
import { isAxiosError } from "axios";
import { isApplicationError } from "@/composables/useApplicationError";
import { useUserStore } from "@/stores/userStore";
import Book from "@/components/Book.vue";

const userStore = useUserStore();
const estante = ref({} as Estante);
const exception = ref<ApplicationError>();
const loading = ref(true);
const user_id = userStore.user.id;

const fetchEstanteByUser = async () => {
  try {
    const { data } = await api.get(
      `/estantes?populate=livros.Capa, users_permissions_user`,
      {
        headers: {
          Authorization: `Bearer ${userStore.jwt}`,
        },
      }
    );
    let biblioteca = data.data;
    console.log(biblioteca);

    console.log(user_id);

    for (let i = 0; i < biblioteca.length; i++) {
      if (biblioteca[i].attributes.users_permissions_user.data.id == user_id) {
        console.log(biblioteca[i].attributes.users_permissions_user.data.id);
        estante.value = biblioteca[i].attributes.livros.data;
      }
    }

    console.log(estante);
    //estante.value = data.data.attributes.livros.data
    //console.log(data.data.attributes.livros.data);

    if (data.data.length === 0) {
      throw new Error("Estante não encontrada para o usuário");
    }
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEstanteByUser();
});
</script>

<template>
  <div v-if="exception" class="alert alert-danger" role="alert">
    {{ exception.error.message }}
  </div>

  <div v-if="loading" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <div v-else class="estante row row-cols-1 row-cols-sm-2 row-cols-md-4 g-8">
    <Book
      v-for="livro in estante"
      :key="livro.id"
      :id="livro.id"
      :nome="livro.attributes.Nome"
      :autor="livro.attributes.Autor"
      :genero="livro.attributes.Genero"
      :sinopse="livro.attributes.Sinopse"
      :nota="livro.attributes.Nota"
      :capa="livro.attributes.Capa"
      :caps="livro.attributes.nCapitulos"
    />
  </div>
</template>

<style scoped>
.estante {
  display: flex;

  justify-content: space-around;
  align-content: center;
  gap: 30px;
  flex-wrap: wrap;
}
</style>

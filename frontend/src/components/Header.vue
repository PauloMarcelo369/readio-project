<template>
  <header>
    <RouterLink to="/"><img src="../assets/logo.png" alt="" /></RouterLink>

    <!-- v-model para armazenar o valor do input -->
    <input
      v-model="searchQuery"
      type="text"
      required
      placeholder="Buscar no catálogo..."
      @keyup.enter="getLivro"
    />
  </header>
</template>

<script setup lang="ts">
import { api } from "@/api";
import { ref, toRaw } from "vue";
import { RouterLink } from "vue-router";
import type { ApplicationError, Livro } from "@/types";
import { isAxiosError } from "axios";
import { isApplicationError } from "@/composables/useApplicationError";
import { useRouter, useRoute } from "vue-router";

const loading = ref(true);
const error = ref<ApplicationError>();
const id = ref("");
const router = useRouter();
const route = useRoute();

const livro = ref([] as Livro[]);

const searchQuery = ref("");

async function getLivro() {
  try {
    const { data } = await api.get(`/livros?populate=Capa`);
    livro.value = data.data;

    const livro_objeto = toRaw(livro._rawValue);

    let achado = false;
    for (let i = 0; i < livro_objeto.length; i++) {
      if (livro_objeto[i].attributes.Nome == searchQuery._value) {
        id.value = livro_objeto[i].id;
        //console.log(id.value)
        achado = true;
        break;
      }
    }

    const currentPath = route.path;
    //const nextPath = id.value
    //.log(currentPath);
    //console.log(nextPath)
    //console.log(searchQuery)

    if (currentPath != "/") {
      //console.log("NOT HOME")
      await router.push("/");
    }

    if (achado == false) {
      router.push({ path: "/:pathMatch(.*)*" });
    } else {
      router.push({ path: `/livros/${id.value}` });
    }

    searchQuery.value = "";
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<!-- digo que o estilo só vai ser adicionado a esse escopo -->
<style scoped>
header {
  display: flex;
  width: 100%;
  gap: 20px;
  height: 25vh;
  padding: 5% 50px;
  justify-content: start;
  align-items: center;
  background-color: var(--white-color);
  transition: 0.2s;
  border-bottom: 3px solid var(--border-base-color);
}

header input {
  background-color: var(--base-input-color);
  font-size: 24px;
  text-align: center;
  width: 80%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: none;
  height: 45px;
  border-radius: 20px;
  padding: 5px;
}

header img {
  width: 100%;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  height: auto;
}

header img:hover {
  transform: scale(1.1);
  rotate: 360deg;
  transition: 0.8s;
}
</style>

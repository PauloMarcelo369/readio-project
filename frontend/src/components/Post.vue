<script setup lang="ts">
import type { Livro, Poste, User } from '@/types';
import { ref, toRaw } from 'vue'
const props = defineProps<Poste>();

const id = ref(0)
const conteudo = ref('')
const dado = ref(0)
const tipo = ref('')
const livro = ref({} as Livro)
const user= ref({} as User)
const caps = ref(0)


id.value = props.id
conteudo.value = props.conteudo
dado.value = props.dado
tipo.value = props.tipo
livro.value = props.livro
user.value = props.user
caps.value = props.livro.data.attributes.nCapitulos

console.log("TO AQUIIII")
console.log(livro.value)
let nota = true

if(props.tipo != "Nota"){
  nota = false
}


livro.value = props.livro
let progresso = (dado.value / caps.value ) * 100

const progressWidth = `${progresso}%`;

</script>

<template>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-left align-items-center">
                    <h5 class="card-title mb-0 me-2">{{ user }}</h5>
                    <p class="card-text mb-0"> 
                        <div v-if="nota">
                        <strong>
                        <small>{{tipo}}</small> <span class="badge text-bg-warning">{{ dado }}</span>
                        </strong>
                      </div>
                    </p>
                </div>
                
                <div v-if="!nota">
                    <strong>
                    <small>{{tipo}}:</small> <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
                                                  <div class="progress-bar" :style="{ width: progressWidth }"></div>
                                              </div>
                    </strong>
                  </div>
                <div class="text-start">
                    
                  <p class="card-text">{{ conteudo }}</p>
                  
                </div>
            </div>
          
        </div>
      </div> 
    </div>
  </template>
  
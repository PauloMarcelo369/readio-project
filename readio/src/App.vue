<template>
  <div class="conteiner">
    <myHeader></myHeader>
  </div>
</template>

<script>
import myHeader from './components/Header.vue'

export default {
  name: 'App',
  components: { myHeader }
}
</script>

<style>
.conteiner {
  display: flex;
  flex-direction: column;
}
</style>

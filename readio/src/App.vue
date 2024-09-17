<template>
  <div class="conteiner">
    <myHeader></myHeader>
    <SideBar></SideBar>
  </div>
</template>

<script>
import myHeader from './components/Header.vue'
import SideBar from './components/sidebar/SideBar.vue'

export default {
  name: 'App',
  components: { myHeader, SideBar }
}
</script>

<style>
.conteiner {
  display: flex;
  flex-direction: column;
}
</style>

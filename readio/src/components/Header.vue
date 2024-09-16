<template>
  <header>
    <img src="../assets/logo.png" alt="" />
    <input type="text" required placeholder="Buscar no catálogo..." />
  </header>
</template>

<script>
export default {
  name: 'myHeader'
}
</script>

<!-- digo que o estilo só vai ser adicionado a esse escopo -->
<style scoped>
header {
  display: flex;
  width: 100%;
  gap: 20px;
  height: 200px;
  padding: 20px 50px;
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
  border: none;
  height: 45px;
  border-radius: 20px;
  padding: 5px;
}

header img {
  width: 220px;
}
</style>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Oops! Página não encontrada.</p>
    <p>A página que você está procurando não existe ou foi movida.</p>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: #333;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #ff6b6b;
}

p {
  font-size: 1.2rem;
  margin: 10px 0;
}
</style>

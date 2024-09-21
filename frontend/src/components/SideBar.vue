<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div v-if="isSidebarVisible" id="sidebar-wrapper">
      <div
        class="btn-group-vertical"
        role="group"
        aria-label="Vertical button group"
      >
        <div class="user">
          <!-- Exibir o nome do usuário -->
          <span>Logged as {{ userStore.username }}</span>
        </div>
        <RouterLink :to="`/posts/${userStore.username}`"
          ><button type="button" class="option-btn">
            Fazer post
          </button></RouterLink
        >
        <RouterLink :to="`/estante/${userStore.username}`"
          ><button type="button" class="option-btn">Estante</button></RouterLink
        >
        <RouterLink to="/"
          ><button type="button" class="option-btn">
            Catálogo
          </button></RouterLink
        >
      </div>
    </div>

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg border-bottom">
        <button
          @click="toggleSidebar"
          class="menu-icon btn fs-1"
          id="menu-toggle"
        >
          <i class="bi bi-list fs-1 text-white"></i>
        </button>
        <template v-if="userStore.username">
          <RouterLink to="/login">
            <a href="#" @click="userStore.logout" class="btn btn-outline-danger"
              >Logout</a
            >
          </RouterLink>
        </template>

        <template v-else
          ><RouterLink to="/login" class="btn-login"
            >Login</RouterLink
          ></template
        >
      </nav>

      <div class="router-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const username = userStore.user.username;

const isSidebarVisible = ref(true);

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value;

  const wrapper = document.getElementById("wrapper");
  if (wrapper) {
    wrapper.classList.toggle("sidebar-hidden", !isSidebarVisible.value);
    wrapper.classList.toggle("sidebar-visible", isSidebarVisible.value);
  }
}
</script>

<style scoped>
#wrapper {
  display: flex;
  height: 75vh;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;
  position: relative;
  transition: margin-left 0.3s;
}

.user {
  text-align: center;
  color: rgb(248, 249, 250);
  font-size: 25px;
}

.user span {
  font-family: Verdana, Geneva, Tahoma;
  text-shadow: 0 0 10px rgb(0, 0, 0, 0.8);
}

#sidebar-wrapper {
  height: inherit;
  border: none;
  padding: 20px;
  background-color: var(--item-color);
  min-width: 250px;
  max-width: 275px;
  transition: transform 0.3s;
  position: absolute;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.menu-icon:hover {
  transform: scale(1.12);
  transition: 0.4s;
}

.router-content {
  padding: 5%;
  overflow-y: auto;
  height: 85%;
}

#page-content-wrapper {
  flex: 1;
  transition: margin-left 0.3s;
  overflow: hidden;
  margin-left: 250px;
}

.sidebar-hidden #sidebar-wrapper {
  transform: translateX(-100%);
}

.sidebar-visible #sidebar-wrapper {
  transform: translateX(0);
}

.sidebar-hidden #page-content-wrapper {
  margin-left: 0;
}

.sidebar-visible #page-content-wrapper {
  margin-left: 250px;
}

nav {
  display: flex;
  padding: 24px;
  background-color: var(--item-color);
  height: 15%;
  justify-content: space-between;
  align-items: center;
  z-index: 2000;
}

#sidebar-wrapper .list-group-item {
  margin-top: 10px;
  margin-bottom: 10px;
}

.btn {
  margin-bottom: 10px;
}

.option-btn {
  border-radius: 20px;
  border: none;
  width: 100%;
  text-align: center;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
  height: 100%;
  padding: 15px;
}

.option-btn:hover {
  transform: scale(1.05);
  transition: 0.5s;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
}

.btn-login {
  border-radius: 15px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background-color: aliceblue;
  color: black;
  text-align: center;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
  height: 100%;
  padding: 25px;
  font-size: 12px;
  text-align: center;
}

.btn-login:hover {
  transform: scale(1.05);
  transition: 0.5s;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
}

.btn-group-vertical {
  display: flex;
  width: 100%;
  gap: 40px;
  justify-content: center;
  align-items: stretch;
  flex-grow: 1;
  flex-direction: column;
}

#sidebar-wrapper .btn-group-vertical > .option-btn {
  flex-grow: 1;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  #menu-toggle {
    margin: 0;
  }

  nav a,
  nav .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>

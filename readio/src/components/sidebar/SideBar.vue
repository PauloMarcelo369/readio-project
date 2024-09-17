<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div v-if="isSidebarVisible" id="sidebar-wrapper">
      <div class="sidebar-heading">Menu</div>
      <div class="list-group list-group-flush">
        <a href="#" class="list-group-item list-group-item-action bg-light">Dashboard</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Profile</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Settings</a>
      </div>
    </div>

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg border-bottom">
        <button @click="toggleSidebar" class="btn btn-primary" id="menu-toggle">
          Toggle Sidebar
        </button>
        <p>Login</p>
      </nav>

      <div class="container-fluid">
        <h1 class="mt-4">Collapsible Sidebar</h1>
        <p>This is a simple sidebar that can be collapsed by clicking the button.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarVisible = ref(true)

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<style scoped>
#wrapper {
  display: flex;
  flex-wrap: nowrap;
}

#sidebar-wrapper {
  height: 75vh;
  border: none;
  background-color: var(--item-color);
  min-width: 500px;
}

#page-content-wrapper {
  flex: 1;
}

nav {
  display: flex;
  padding: 24px;
  background-color: var(--item-color);
  height: 100px;
  justify-content: space-between;
  align-items: center;
}

.border-right {
  border-right: 1px solid #dee2e6;
}
</style>

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './styles/global.css';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
// Utiliza o Pinia (gerenciamento de estado)
app.use(createPinia());

// Habilita o roteamento (descomentado quando configurado)
// app.use(router);

// Monta a aplicação no elemento com o ID 'app'
app.use(router)
app.mount('#app');

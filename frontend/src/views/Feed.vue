<template>
  <div class="feed-container">
    <header>
      <h1>📰 App Notícias</h1>
      <button @click="logout" class="btn-logout">Sair</button>
    </header>

    <div class="preferences-box">
      <h3>Selecione suas preferências:</h3>
      <div class="checkboxes">
        <label v-for="cat in availableCategories" :key="cat">
          <input type="checkbox" :value="cat" v-model="selectedCategories" />
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </label>
      </div>
      <button @click="savePreferences" :disabled="loading">
        {{ loading ? 'Salvando...' : '🔔 Ativar Notificações' }}
      </button>
    </div>

    <div class="news-feed">
      <h3>Suas Notícias</h3>
      <p>As notícias aparecerão aqui (via notificação).</p>
      </div>
  </div>
</template>

<script>
import { registerSubscription } from '../services/pushService';

export default {
  data() {
    return {
      availableCategories: ['tecnologia', 'saude', 'negocios', 'natureza', 'politica'],
      selectedCategories: [],
      loading: false
    };
  },
  methods: {
    async savePreferences() {
      this.loading = true;
      try {
        // Chama o serviço que pede permissão ao navegador e gera a chave
        // Nota: O pushService.js deve apontar para localhost:4000
        await registerSubscription(this.selectedCategories);
        alert("Preferências salvas! Você receberá notificações.");
      } catch (error) {
        console.error(error);
        alert("Erro: " + error.message);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await fetch("http://localhost:4000/api/auth/logoff");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.feed-container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.preferences-box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #eee; }
.checkboxes label { display: inline-block; margin-right: 15px; margin-bottom: 10px; cursor: pointer; }
button { background: #4DBA87; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-logout { background: #ff4d4d; }
button:disabled { background: #ccc; }
</style>
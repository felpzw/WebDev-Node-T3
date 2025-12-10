<template>
  <div class="feed-container">
    <header>
      <h1>📰 App Notícias</h1>
      <button @click="logout" class="btn-logout">Sair</button>
    </header>

    <div class="preferences-box">
      <h3>Selecione suas preferências:</h3>
      <p class="hint">Marque as categorias para receber notificações e filtrar seu feed.</p>
      
      <div class="checkboxes">
        <label v-for="cat in availableCategories" :key="cat">
          <input type="checkbox" :value="cat" v-model="selectedCategories" />
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </label>
      </div>

      <button @click="savePreferences" :disabled="loading" class="btn-save">
        {{ loading ? 'Salvando...' : '🔔 Ativar Notificações & Atualizar Feed' }}
      </button>
    </div>

    <div class="news-feed">
      <h3>Suas Notícias</h3>
      
      <div v-if="loadingNews" class="loading-state">
        <p>Carregando notícias...</p>
      </div>

      <div v-else-if="newsList.length === 0" class="empty-state">
        <p>Nenhuma notícia encontrada.</p>
        <small>Verifique se você marcou categorias acima ou se o admin postou algo.</small>
      </div>

      <div v-else class="news-list">
        <div v-for="news in newsList" :key="news._id" class="news-card">
          <div class="card-header">
            <h4>{{ news.title }}</h4>
            <span :class="['tag', news.context]">{{ news.context }}</span>
          </div>
          <p class="card-content">{{ news.content }}</p>
          <div class="card-footer">
            <small>Publicado em: {{ new Date(news.createdAt).toLocaleDateString() }}</small>
          </div>
        </div>
      </div>
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
      newsList: [],
      loading: false,     
      loadingNews: false 
    };
  },
  async mounted() {
    const savedCats = localStorage.getItem('user_categories');
    if (savedCats) {
      this.selectedCategories = JSON.parse(savedCats);
    }

    await this.fetchNews();
  },
  methods: {
    async fetchNews() {
      this.loadingNews = true;
      try {
        // GET para buscar notícias baseadas no perfil do usuário
        // credentials: 'include' é ESSENCIAL para enviar o cookie de sessão
        const res = await fetch('http://localhost:4000/api/news', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' 
        });

        if (res.ok) {
          this.newsList = await res.json();
        } else {
          console.error("Erro ao buscar notícias:", res.status);
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar notícias:", error);
      } finally {
        this.loadingNews = false;
      }
    },

    async savePreferences() {
      if (this.selectedCategories.length === 0) {
        alert("Por favor, selecione pelo menos uma categoria.");
        return;
      }

      this.loading = true;
      try {
        // 1. Registra o Service Worker e envia inscrição para o Backend
        await registerSubscription(this.selectedCategories);
        
        // 2. Salva no localStorage para manter os checkboxes marcados ao recarregar
        localStorage.setItem('user_categories', JSON.stringify(this.selectedCategories));

        alert("Preferências salvas! Você receberá notificações destas categorias.");
        
        // 3. Recarrega a lista de notícias para refletir as novas categorias
        await this.fetchNews();

      } catch (error) {
        console.error(error);
        alert("Erro ao salvar: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await fetch("http://localhost:4000/api/auth/logoff", { credentials: 'include' });
        localStorage.removeItem('user_categories');
        this.$router.push("/login");
      } catch (e) {
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style scoped>
.feed-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

h1 { margin: 0; color: #2c3e50; font-size: 1.5rem; }

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-logout { background: #ff4d4d; color: white; }
.btn-save { background: #4DBA87; color: white; width: 100%; margin-top: 15px; }

.preferences-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #e9ecef;
}
.hint { color: #6c757d; font-size: 0.9rem; margin-bottom: 15px; }
.checkboxes label {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  background: white;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
}
.checkboxes input { margin-right: 8px; }

.news-feed h3 { color: #2c3e50; border-left: 4px solid #4DBA87; padding-left: 10px; }

.news-card {
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: transform 0.1s;
}
.news-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.card-header h4 { margin: 0; font-size: 1.1rem; color: #333; }

.tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
  color: #555;
  background: #eee;
}
/* Cores opcionais para tags */
.tag.tecnologia { background: #e3f2fd; color: #1565c0; }
.tag.saude { background: #e8f5e9; color: #2e7d32; }
.tag.negocios { background: #fff3e0; color: #ef6c00; }

.card-content { color: #555; line-height: 1.5; }
.card-footer { margin-top: 15px; color: #999; font-size: 0.85rem; text-align: right; }

.empty-state, .loading-state { text-align: center; color: #777; padding: 40px; }
</style>
<template>
  <div class="container">
    <h2>Entrar</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Usuário:</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>Senha:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Acessar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p><router-link to="/register">Criar conta</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return { username: "", password: "", error: "" };
  },
  methods: {
    async login() {
      try {
        // Atenção para a porta 4000 definida no seu .env
        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });

        if (res.ok) {
          // Salva username no localStorage apenas para exibir na tela depois (opcional)
          localStorage.setItem("username", this.username);
          this.$router.push("/feed");
        } else {
          this.error = "Credenciais inválidas";
        }
      } catch (e) {
        this.error = "Erro ao conectar com o servidor";
      }
    }
  },
};
</script>

<style scoped>
.container { max-width: 300px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.form-group { margin-bottom: 15px; }
input { width: 100%; padding: 8px; margin-top: 5px; }
button { width: 100%; padding: 10px; background: #4DBA87; color: white; border: none; cursor: pointer; }
.error { color: red; font-size: 0.9em; }
</style>
<template>
  <div class="container">
    <h2>Nova Conta</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Usuário:</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>Senha:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
    <p><router-link to="/login">Voltar para Login</router-link></p>
  </div>
</template>

<script>
export default {
  data() { return { username: "", password: "" }; },
  methods: {
    async register() {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.username, password: this.password }),
      });

      if (res.ok) {
        alert("Conta criada! Faça login.");
        this.$router.push("/login");
      } else {
        alert("Erro ao criar conta. Tente outro usuário.");
      }
    }
  },
};
</script>

<style scoped>
.container { max-width: 300px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
input { width: 100%; padding: 8px; margin-top: 5px; margin-bottom: 10px; }
button { width: 100%; padding: 10px; background: #35495e; color: white; border: none; cursor: pointer; }
</style>
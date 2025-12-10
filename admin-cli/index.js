
const categoria = process.argv[2];
const conteudo = process.argv[3];
const titulo = process.argv[4] || "Nova Notícia"; // Opcional: permitir título ou gerar automático

// Validação simples
const categoriasValidas = ['tecnologia', 'saude', 'negocios', 'natureza', 'politica'];

if (!categoria || !conteudo) {
    console.error("\n❌ Erro: Parâmetros faltando.");
    console.log("Uso correto: node noticia.js <categoria> <conteudo> [titulo_opcional]");
    console.log("Exemplo: node noticia.js tecnologia \"Novo processador lançado\"\n");
    process.exit(1);
}

if (!categoriasValidas.includes(categoria.toLowerCase())) {
    console.error(`\n❌ Erro: Categoria '${categoria}' inválida.`);
    console.log(`Permitidas: ${categoriasValidas.join(', ')}\n`);
    process.exit(1);
}

// Configuração do envio
const SERVER_URL = 'http://localhost:4000/api/news/publish'; // Ajuste a porta se necessário

async function enviarNoticia() {
    try {
        console.log(`\n📡 Enviando notícia sobre [${categoria}] para o servidor...`);

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-secret': 'adminsecret'
            },
            body: JSON.stringify({
                title: titulo,
                context: categoria.toLowerCase(),
                content: conteudo
            })
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Sucesso!");
        console.log(`📢 Mensagem: ${data.message}`);
        if (data.notifiedCount !== undefined) {
            console.log(`👥 Usuários notificados: ${data.notifiedCount}`);
        }

    } catch (error) {
        console.error("❌ Falha ao enviar notícia:");
        if (error.code === 'ECONNREFUSED') {
            console.error("O servidor parece estar desligado. Verifique se o backend está rodando na porta 3000.");
        } else {
            console.error(error.message);
        }
    }
}

enviarNoticia();
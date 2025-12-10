const User = require('../../models/user');

exports.updatePreferences = async (req, res) => {
    try {
        const username = req.username.username; 
        
        const { categories, subscription } = req.body;

        if (!categories || !subscription) {
            return res.status(400).json({ message: "Categorias e Subscription são obrigatórios." });
        }

        // Busca o usuário pelo username e atualiza os campos
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { 
                categories: categories, 
                subscription: subscription 
            },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        console.log(`Preferências atualizadas para: ${username}`);
        res.status(200).json({ 
            message: 'Preferências atualizadas com sucesso!',
            user: {
                username: updatedUser.username,
                categories: updatedUser.categories
            }
        });

    } catch (error) {
        console.error("Erro ao atualizar preferências:", error);
        res.status(500).json({ message: 'Erro interno ao salvar preferências.' });
    }
};
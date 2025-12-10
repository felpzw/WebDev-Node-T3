const News = require('../../models/news');
const User = require('../../models/user');
const webpush = require('web-push');

webpush.setVapidDetails(
    process.env.MAILTO,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.createNews = async (req, res) => {
    try {
        const { title, context, content } = req.body;

        const newNews = new News({ title, context, content });
        await newNews.save();

        console.log(`Notícia criada: ${title} [${context}]`);

        const usersToNotify = await User.find({
            categories: context,
            subscription: { $exists: true, $ne: null }
        });

        const notificationPayload = JSON.stringify({
            title: `Nova notícia de ${context}!`,
            body: title,
            url: '/feed' 
        });

        const pushPromises = usersToNotify.map(user => {
            return webpush.sendNotification(user.subscription, notificationPayload)
                .catch(err => {
                    console.error(`Erro ao enviar para ${user.username}:`, err.statusCode);
                });
        });

        await Promise.allSettled(pushPromises);

        res.status(201).json({ 
            message: 'Notícia publicada e notificações enviadas.',
            notifiedCount: usersToNotify.length 
        });

    } catch (error) {
        console.error("Erro ao publicar notícia:", error);
        res.status(500).json({ message: 'Erro ao processar notícia', error: error.message });
    }
};

exports.getMyNews = async (req, res) => {
    try {
        const username = req.username.username;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        const news = await News.find({ 
            context: { $in: user.categories } 
        }).sort({ createdAt: -1 }); // Mais recentes primeiro

        res.json(news);

    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        res.status(500).json({ message: "Erro ao carregar feed" });
    }
};
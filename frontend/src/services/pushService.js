//require("dotenv").config();

const PUBLIC_KEY = BPXkGD8lFCpTspZEsnGH80rkm4BOvFJmsncEEsjFWSbIe6BBQyrOq9Ey1tmOTc9tHH2gwVrR1hjkUzu4p5RD-mQ;

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function registerSubscription(selectedCategories) {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker não suportado');
    }

    // 1. Registra o Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW Registrado:', registration);

    // 2. Pede permissão ao usuário
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Permissão de notificação negada');
    }

    // 3. Cria a assinatura do Push (Subscription)
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
    });

    // 4. Envia tudo para o Backend (AQUI ESTÁ A MUDANÇA PRINCIPAL DA AULA)
    // Recupera o token salvo no login (ajuste conforme onde você salvou: localStorage ou Cookie)
    // Se estiver usando Cookie httpOnly, não precisa mandar header Authorization manual se o browser enviar cookies automaticamente.
    // Mas se salvou no localStorage:
    // const token = localStorage.getItem('token'); 

    const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Descomente se não estiver usando Cookies
        },
        body: JSON.stringify({
            categories: selectedCategories, // Ex: ['tecnologia', 'saude']
            subscription: subscription
        })
    });

    if (!response.ok) {
        throw new Error('Falha ao salvar preferências no servidor');
    }

    return await response.json();
}
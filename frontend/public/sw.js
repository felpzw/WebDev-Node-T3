self.addEventListener("install", (event) => {
    console.log("Service Worker instalado");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker ativado");
});

self.addEventListener("push", function (event) {
    const data = event.data ? event.data.json() : {};
    
    event.waitUntil(
        self.registration.showNotification(data.title || "Nova Notícia", {
            body: data.body || "Confira as novidades!",
            icon: "/img/icons/icon-192x192.png", 
            data: { url: data.url || "/" } // Guarda a URL para usar no clique
        })
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
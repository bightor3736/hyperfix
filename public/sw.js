/* Hyperfix service worker — push notifications + click handling */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    try {
      payload = { title: "Hyperfix", body: event.data ? event.data.text() : "" };
    } catch (_) {
      payload = {};
    }
  }

  const title = payload.title || "Hyperfix";
  const options = {
    body: payload.body || "",
    icon: payload.icon || "/icon?size=192",
    badge: payload.badge || "/icon?size=192",
    data: {
      url: payload.url || "/dashboard",
    },
    tag: payload.tag || "hyperfix-reminder",
    renotify: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/dashboard";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Focus an existing window if available
      for (const client of allClients) {
        try {
          const url = new URL(client.url);
          if (url.origin === self.location.origin) {
            await client.focus();
            if ("navigate" in client) {
              try {
                await client.navigate(targetUrl);
              } catch (_) {
                // ignore
              }
            }
            return;
          }
        } catch (_) {
          // ignore
        }
      }

      // Otherwise open a new window
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});

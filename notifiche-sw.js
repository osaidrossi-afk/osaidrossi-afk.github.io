// Notifiche sul telefono anche ad app chiusa: le manda la funzione «notifica» quando un lead risponde o un'email non arriva.
self.addEventListener('push', (event) => {
  let d = {}
  try { d = event.data ? event.data.json() : {} } catch (e) { d = { titolo: 'CRM Teatro', testo: event.data ? event.data.text() : '' } }
  event.waitUntil(
    self.registration.showNotification(d.titolo || 'CRM Teatro', {
      body: d.testo || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: d.url || '/' },
      tag: d.url || 'crm',
      renotify: true,
    }),
  )
})

// Tocco sulla notifica: apre l'app (o la porta davanti) sulla scheda giusta.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((finestre) => {
      for (const f of finestre) {
        if (f.url.startsWith(self.location.origin) && 'focus' in f) {
          f.navigate(url).catch(() => {})
          return f.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})

// Service worker del VECCHIO indirizzo (osaidrossi-afk.github.io), dal 10/11/2026.
// Sostituisce quello dell'app: butta la copia dell'app tenuta in memoria, così chi la apre dall'icona vecchia
// arriva alla pagina di rinvio e da lì al nuovo indirizzo. Le notifiche già attivate su questo indirizzo
// continuano ad arrivare (notifiche-sw.js) finché non si riattivano sulla piattaforma nuova.
importScripts('notifiche-sw.js')

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k)
    await self.clients.claim()
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url).catch(() => {})
  })())
})
// Nessun gestore «fetch»: ogni pagina arriva dal sito, cioè dal rinvio.

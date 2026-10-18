// Pagina per il catering (Fation): le prossime serate di Voci d'Italia con il numero di ospiti che Osaid aggiorna nel CRM.
// La chiave arriva nell'indirizzo dopo «#» (non viene mai mandata al sito) e la funzione del database restituisce
// solo date e numeri: nessun nome, nessun dato dei clienti.
(function () {
  var URL = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/rest/v1/rpc/serate_catering'
  var KEY = 'sb_publishable_Q4d6rxfR-VnNOf1mZmHSLw_nvwG8ohC'
  var chiave = decodeURIComponent((location.hash || '').replace(/^#/, ''))
  var contenuto = document.getElementById('contenuto')
  var aggiornato = document.getElementById('aggiornato')
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato']
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

  function testo(tag, classe, t) {
    var el = document.createElement(tag)
    if (classe) el.className = classe
    if (t != null) el.textContent = t
    return el
  }
  function oggiIso() {
    var d = new Date()
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }

  function mostra(serate) {
    contenuto.textContent = ''
    if (!serate.length) {
      contenuto.appendChild(testo('p', 'errore', 'Nelle prossime tre settimane non ci sono serate in programma.'))
      return
    }
    var oggi = oggiIso()
    var lista = testo('ol')
    serate.forEach(function (s) {
      var p = s.data.split('-').map(Number)
      var d = new Date(p[0], p[1] - 1, p[2])
      var li = testo('li', s.data === oggi ? 'oggi' : '')
      var quando = testo('div', 'quando', GIORNI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()])
      if (s.data === oggi) quando.appendChild(testo('small', '', 'stasera'))
      li.appendChild(quando)
      var tot = (s.tlite || 0) + (s.ciaoflorence || 0)
      var haNumeri = s.tlite != null || s.ciaoflorence != null
      var num = testo('div', 'numero' + (haNumeri ? '' : ' vuoto'))
      num.appendChild(testo('strong', '', haNumeri ? String(tot) : '—'))
      num.appendChild(testo('span', '', haNumeri ? 'ospiti' : 'ancora da contare'))
      li.appendChild(num)
      var dett = []
      if (s.aggiornato_il) {
        var a = new Date(s.aggiornato_il)
        dett.push('aggiornato ' + a.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' alle ' +
          a.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }))
      }
      li.appendChild(testo('div', 'dett', dett.join(' · ')))
      if (s.da_confermare) li.appendChild(testo('span', 'dubbio', 'Serata ancora da confermare'))
      if (s.nota) li.appendChild(testo('div', 'nota', s.nota))
      lista.appendChild(li)
    })
    contenuto.appendChild(lista)
  }

  function carica() {
    if (!chiave) {
      contenuto.textContent = ''
      contenuto.appendChild(testo('p', 'errore', 'Questo indirizzo non è completo: chiedi a Osaid il link giusto.'))
      return
    }
    fetch(URL, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ chiave: chiave }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      })
      .then(function (d) {
        mostra(d.serate || [])
        aggiornato.textContent = 'Ultimo controllo: ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      })
      .catch(function () {
        contenuto.textContent = ''
        contenuto.appendChild(testo('p', 'errore', 'Non riesco a leggere le serate. Controlla la connessione o chiedi a Osaid il link aggiornato.'))
      })
  }

  carica()
  setInterval(carica, 120000)
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') carica() })
})()

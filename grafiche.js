// Pagina «Grafiche della serata»: chi prepara la serata (anche dal telefono) scrivono artisti e programma; le grafiche si disegnano qui,
// nel browser, sugli sfondi esportati da Canva (grafiche/render.js + modelli.js). Niente si manda a servizi esterni:
// i dati della serata passano solo dalle funzioni del database (chiave nell'indirizzo, dopo «#», come catering.html).
(function () {
  var RPC = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/rest/v1/rpc/'
  var APIKEY = 'sb_publishable_Q4d6rxfR-VnNOf1mZmHSLw_nvwG8ohC'
  var partiHash = decodeURIComponent((location.hash || '').replace(/^#/, '')).split('&')
  var chiave = partiHash[0]
  var dataDaLink = (partiHash.filter(function (p) { return /^d=\d{4}-\d{2}-\d{2}$/.test(p) })[0] || '').slice(2)
  var $ = function (id) { return document.getElementById(id) }
  var T = window.GRAFICHE_TESTI
  var tabCorrente = 'esterni-artisti'
  var gettone = 0
  var attesaAnteprima = null
  var attesaSalva = null
  var ultimoSalvato = ''
  var caricando = false
  var statoSerata = 'bozza'
  var BOZZA = 'grafiche-bozza-3'

  var TABS = [
    { id: 'esterni-artisti', nome: 'Esterni · nomi', file: 'esterni-nomi', modello: function () { return 'esterni-artisti' } },
    { id: 'programma', nome: 'Esterni · programma', file: 'esterni-programma', modello: function () { return 'esterni-programma' } },
    { id: 'ledwall', nome: 'Ledwall · tappo', file: 'ledwall-tappo', modello: function () { return 'ledwall-programma' } },
    { id: 'interni', nome: 'Interni · nomi', file: 'interni-nomi', modello: function () { return 'wide-artisti' } },
  ]

  function el(tag, classe, testo) {
    var e = document.createElement(tag)
    if (classe) e.className = classe
    if (testo != null) e.textContent = testo
    return e
  }

  function oggiIso() {
    var d = new Date()
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }

  function chiamata(nome, corpo) {
    return fetch(RPC + nome, {
      method: 'POST',
      headers: { apikey: APIKEY, Authorization: 'Bearer ' + APIKEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status === 400 || r.status === 401 || r.status === 403 ? 'chiave' : 'rete')
      return r.json()
    })
  }

  // ---------- elenco del programma ----------
  var elenco

  function campo(classe, etichetta, segnaposto, lista, valore) {
    var w = el('div')
    w.appendChild(el('label', null, etichetta))
    var inp = el('input', classe)
    inp.setAttribute('autocomplete', 'off')
    if (lista) inp.setAttribute('list', lista)
    inp.placeholder = segnaposto
    inp.value = valore || ''
    inp.setAttribute('aria-label', etichetta)
    w.appendChild(inp)
    return w
  }

  function bottone(testo, etichetta, azione, classe) {
    var b = el('button', classe, testo)
    b.type = 'button'
    b.setAttribute('aria-label', etichetta)
    b.addEventListener('click', azione)
    return b
  }

  function creaVoce(v) {
    var tipo = v.tipo === 'solo' || v.tipo === 'intervallo' ? v.tipo : 'brano'
    var d = el('div', 'voce ' + (tipo === 'solo' ? 'solo-piano' : tipo))
    d.dataset.tipo = tipo
    var testa = el('div', 'testa')
    var maniglia = el('button', 'maniglia', '☰')
    maniglia.type = 'button'
    maniglia.setAttribute('aria-label', 'Trascina per spostare (oppure usa le frecce)')
    testa.appendChild(maniglia)
    testa.appendChild(el('span', 'titolo-voce', tipo === 'solo' ? 'PEZZO SOLO PIANOFORTE' : tipo === 'intervallo' ? 'INTERVALLO · Interval Drink, Jazz Bar Open' : 'BRANO'))
    testa.appendChild(bottone('▲', 'Sposta su', function () { sposta(d, -1) }))
    testa.appendChild(bottone('▼', 'Sposta giù', function () { sposta(d, 1) }))
    if (tipo !== 'intervallo') testa.appendChild(bottone('✕', 'Togli', function () { d.remove(); rinumera(); cambiato() }))
    d.appendChild(testa)
    if (tipo === 'brano') {
      d.appendChild(campo('titolo', 'Titolo', 'titolo del brano', 'lista-titoli', v.titolo))
      var coppia = el('div', 'coppia')
      coppia.appendChild(campo('opera', 'Opera o genere', 'es. from … oppure Romance for voice and piano', 'lista-opere', v.opera))
      coppia.appendChild(campo('autore', 'Autore', 'nome e cognome dell’autore', 'lista-autori', v.autore))
      d.appendChild(coppia)
    } else if (tipo === 'solo') {
      var w = el('div')
      w.appendChild(el('label', null, 'Come si legge nella grafica'))
      var t = el('textarea', 'testo-solo')
      t.rows = 2
      t.value = v.testo || 'Piano Solo'
      t.setAttribute('aria-label', 'Testo del pezzo solo per pianoforte')
      w.appendChild(t)
      d.appendChild(w)
    }
    pronteManiglia(d, maniglia)
    return d
  }

  function sposta(voce, verso) {
    var altro = verso < 0 ? voce.previousElementSibling : voce.nextElementSibling
    if (!altro) return
    if (verso < 0) elenco.insertBefore(voce, altro)
    else elenco.insertBefore(altro, voce)
    rinumera()
    cambiato()
    voce.querySelector('.testa button:nth-child(' + (verso < 0 ? 3 : 4) + ')').focus()
  }

  // Trascinamento con il dito o con il mouse (sulla maniglia ☰)
  function pronteManiglia(voce, maniglia) {
    var attivo = false
    maniglia.addEventListener('pointerdown', function (e) {
      attivo = true
      voce.classList.add('trascinata')
      try { maniglia.setPointerCapture(e.pointerId) } catch (x) {}
      e.preventDefault()
    })
    maniglia.addEventListener('pointermove', function (e) {
      if (!attivo) return
      var altre = Array.prototype.filter.call(elenco.children, function (c) { return c !== voce })
      var prima = null
      for (var i = 0; i < altre.length; i++) {
        var r = altre[i].getBoundingClientRect()
        if (e.clientY < r.top + r.height / 2) { prima = altre[i]; break }
      }
      if (prima) { if (voce.nextElementSibling !== prima) elenco.insertBefore(voce, prima) }
      else if (voce !== elenco.lastElementChild) elenco.appendChild(voce)
      if (e.clientY < 70) window.scrollBy(0, -14)
      else if (e.clientY > window.innerHeight - 70) window.scrollBy(0, 14)
    })
    function fine() {
      if (!attivo) return
      attivo = false
      voce.classList.remove('trascinata')
      rinumera()
      cambiato()
    }
    maniglia.addEventListener('pointerup', fine)
    maniglia.addEventListener('pointercancel', fine)
  }

  function rinumera() {
    var n = 0
    Array.prototype.forEach.call(elenco.children, function (c) {
      if (c.dataset.tipo === 'brano') { n++; c.querySelector('.titolo-voce').textContent = 'BRANO ' + n }
    })
  }

  function scriviVoci(voci) {
    elenco.textContent = ''
    var conIntervallo = voci.some(function (v) { return v.tipo === 'intervallo' })
    if (!conIntervallo) {
      var meta = Math.ceil(voci.length / 2)
      voci = voci.slice(0, meta).concat([{ tipo: 'intervallo' }], voci.slice(meta))
    }
    var visto = false
    voci.forEach(function (v) {
      if (v.tipo === 'intervallo') { if (visto) return; visto = true }
      elenco.appendChild(creaVoce(v))
    })
    rinumera()
  }

  function leggiVoci() {
    return Array.prototype.map.call(elenco.children, function (c) {
      if (c.dataset.tipo === 'intervallo') return { tipo: 'intervallo' }
      if (c.dataset.tipo === 'solo') return { tipo: 'solo', testo: c.querySelector('.testo-solo').value }
      return { tipo: 'brano', titolo: c.querySelector('.titolo').value, opera: c.querySelector('.opera').value, autore: c.querySelector('.autore').value }
    })
  }

  function vociIniziali() {
    var b = { tipo: 'brano' }
    return [b, b, b, b, { tipo: 'solo' }, b, { tipo: 'intervallo' }, b, b, { tipo: 'solo' }, b, b]
  }

  function datalist(id, voci) {
    var d = el('datalist')
    d.id = id
    voci.forEach(function (v) { var o = el('option'); o.value = v; d.appendChild(o) })
    document.body.appendChild(d)
  }

  function preparaListe() {
    var rep = window.GRAFICHE_REPERTORIO || []
    function unici(campo) { var v = {}; rep.forEach(function (r) { v[r[campo]] = 1 }); return Object.keys(v) }
    datalist('lista-titoli', unici('titolo'))
    datalist('lista-opere', unici('opera'))
    datalist('lista-autori', unici('autore'))
  }

  // ---------- modulo ----------
  function leggiForm() {
    return {
      orario: $('orario').value, quando: $('quando').value, soprano: $('soprano').value, ruolo2: $('ruolo2').value, voce2: $('voce2').value,
      pianista: $('pianista').value, voci: leggiVoci(),
    }
  }

  function scriviForm(d) {
    $('orario').value = d.orario || '20.30'
    $('soprano').value = d.soprano || ''
    $('ruolo2').value = ['Tenor', 'Baritone', 'Bass-baritone'].indexOf(d.ruolo2) >= 0 ? d.ruolo2 : 'Tenor'
    $('voce2').value = d.voce2 || ''
    $('pianista').value = d.pianista || ''
    $('quando').value = d.quando === 'Tomorrow' ? 'Tomorrow' : 'Tonight'
    scriviVoci(Array.isArray(d.voci) && d.voci.length ? d.voci : vociIniziali())
  }

  // Se la serata è domani (o più in là) il titolo diventa «Tomorrow», altrimenti «Tonight»; si può sempre cambiare a mano.
  function quandoDaData() {
    var data = $('data').value
    if (data) $('quando').value = data > oggiIso() ? 'Tomorrow' : 'Tonight'
  }

  // I brani senza titolo non si disegnano (restano nell'elenco per essere riempiti).
  function perDisegno(d) {
    return {
      orario: String(d.orario || '').trim(), quando: d.quando, soprano: String(d.soprano || '').trim(), ruolo2: d.ruolo2, voce2: String(d.voce2 || '').trim(),
      pianista: String(d.pianista || '').trim(),
      voci: d.voci.filter(function (v) { return v.tipo !== 'brano' || String(v.titolo || '').trim() }),
    }
  }

  function campiMancanti(d) {
    var n = 0
    ;['orario', 'soprano', 'voce2', 'pianista'].forEach(function (k) { if (!String(d[k] || '').trim()) n++ })
    d.voci.forEach(function (v) { if (v.tipo === 'brano' && !String(v.titolo || '').trim()) n++ })
    return n
  }

  // ---------- anteprima ----------
  function modelloDi(tab) { return window.GRAFICHE_MODELLI[tab.modello()] }
  function tabAttuale() { return TABS.filter(function (t) { return t.id === tabCorrente })[0] }

  function aggiornaTab() {
    var box = $('tab')
    box.textContent = ''
    TABS.forEach(function (t) {
      var b = el('button', null, t.nome)
      b.type = 'button'
      b.setAttribute('aria-pressed', t.id === tabCorrente)
      b.addEventListener('click', function () { tabCorrente = t.id; aggiornaTab(); anteprima(0) })
      box.appendChild(b)
    })
  }

  function mostraControllo(g) {
    var c = $('controllo')
    if (!g) { c.textContent = ''; c.className = 'controllo'; return }
    var troppoPiccolo = g.minimo && g.scala < g.minimo
    if (g.problemi.length || troppoPiccolo) {
      c.className = 'controllo attenzione'
      c.textContent = troppoPiccolo
        ? 'Troppi brani o testi troppo lunghi: per farli entrare il testo diventerebbe troppo piccolo (' + Math.round(g.scala * 100) + '%). Togli qualcosa o accorcia.'
        : 'Attenzione: ' + g.problemi.join('; ') + '.'
    } else {
      c.className = 'controllo ok'
      c.textContent = 'Tutto il testo entra nella grafica.' + (g.scala < 1 ? ' Per farcelo stare è al ' + Math.round(g.scala * 100) + '% della dimensione standard (stessi font).' : '')
    }
  }

  function anteprima(ritardo) {
    clearTimeout(attesaAnteprima)
    attesaAnteprima = setTimeout(function () {
      var tab = tabAttuale()
      var m = modelloDi(tab)
      var mio = ++gettone
      $('caricamento').textContent = 'Preparo la grafica…'
      var d = perDisegno(leggiForm())
      var canvas = $('anteprima')
      var tmp = document.createElement('canvas')
      window.GRAFICHE_RENDER.disegna(tmp, m, d, { scala: Math.min(1, 760 / m.w) }).then(function () {
        if (mio !== gettone) return
        canvas.width = tmp.width
        canvas.height = tmp.height
        canvas.getContext('2d').drawImage(tmp, 0, 0)
        canvas.setAttribute('aria-label', 'Anteprima: ' + tab.nome + '. Soprano ' + d.soprano + ', ' + d.ruolo2 + ' ' + d.voce2 + ', pianoforte ' + d.pianista + '.')
        $('caricamento').textContent = ''
        mostraControllo(tmp.grafiche)
      }).catch(function () {
        if (mio === gettone) $('caricamento').textContent = 'Non riesco a preparare la grafica. Riprova.'
      })
    }, ritardo)
  }

  // ---------- conferma ----------
  function mostraConferma(stato, quando, chi) {
    statoSerata = stato
    var box = $('conferma-stato')
    var b = $('conferma')
    if (stato === 'confermata') {
      var q = quando ? new Date(quando) : null
      box.hidden = false
      box.className = 'controllo ok'
      box.textContent = 'Confermata' + (q ? ' il ' + q.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' alle ' + q.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '') +
        (chi ? ' da ' + chi : '') + '. Il teatro è stato avvisato. Se cambi qualcosa, va confermata di nuovo.'
      b.textContent = 'Confermata ✓'
      b.disabled = true
    } else {
      box.hidden = true
      b.textContent = 'Conferma: è tutto pronto'
      b.disabled = false
    }
  }

  // Prima di confermare si controllano tutte le grafiche (in piccolo): se qualcosa non entra o manca, non si conferma.
  function verificaTutte() {
    var d = perDisegno(leggiForm())
    var problemi = []
    return TABS.reduce(function (p, t) {
      return p.then(function () {
        var c = document.createElement('canvas')
        return window.GRAFICHE_RENDER.disegna(c, modelloDi(t), d, { scala: 0.05 }).then(function () {
          var g = c.grafiche
          if (g.problemi.length || g.scala < g.minimo) problemi.push(t.nome)
        })
      })
    }, Promise.resolve()).then(function () { return problemi })
  }

  function conferma() {
    var mancano = campiMancanti(leggiForm())
    if (mancano) { messaggio('Mancano ancora ' + mancano + ' campi (artisti, orario o titoli dei brani). Completali, poi conferma.', 'attenzione'); return }
    if (!$('chisei').value.trim()) { messaggio('Scrivi il tuo nome in fondo alla pagina («Il tuo nome»), così il teatro sa chi ha confermato.', 'attenzione'); $('chisei').focus(); return }
    $('conferma').disabled = true
    messaggio('Controllo le grafiche e confermo…')
    verificaTutte().then(function (problemi) {
      if (problemi.length) throw new Error('non entra:' + problemi.join(', '))
      return salva(true)
    }).then(function (ok) {
      if (!ok) throw new Error('salvataggio')
      return chiamata('grafiche_conferma', { chiave: chiave, la_data: $('data').value, chi: $('chisei').value })
    }).then(function (r) {
      mostraConferma('confermata', r.confermata_il, $('chisei').value)
      messaggio('Fatto: serata confermata. Il teatro è stato avvisato.', 'ok')
    }).catch(function (e) {
      $('conferma').disabled = false
      var t = e && e.message ? e.message : ''
      messaggio(t.indexOf('non entra:') === 0 ? 'Non confermo: in queste grafiche il testo non entra (' + t.slice(10) + '). Accorcia o togli qualcosa.'
        : 'Non sono riuscito a confermare. Controlla la connessione e riprova.', 'attenzione')
    })
  }

  // ---------- messaggi, bozza, salvataggio ----------
  function messaggio(testo, tipo) {
    var m = $('msg')
    m.hidden = !testo
    m.textContent = testo || ''
    m.className = 'msg' + (tipo ? ' ' + tipo : '')
  }

  function bozzaLocale(scrivi) {
    try {
      if (scrivi) localStorage.setItem(BOZZA, JSON.stringify({ data: $('data').value, dati: leggiForm(), chi: $('chisei').value }))
      else return JSON.parse(localStorage.getItem(BOZZA) || 'null')
    } catch (e) { return null }
    return null
  }

  function salva(silenzioso) {
    var d = leggiForm()
    var data = $('data').value
    if (caricando) return Promise.resolve(false)
    if (!data || !String(d.soprano).trim()) {
      if (!silenzioso) messaggio('Scrivi almeno il giorno e il nome del soprano per salvare.', 'attenzione')
      return Promise.resolve(false)
    }
    return chiamata('grafiche_salva', { chiave: chiave, la_data: data, i_dati: d, chi: $('chisei').value || null }).then(function (r) {
      if (r && r.stato === 'bozza' && statoSerata === 'confermata') mostraConferma('bozza')
      var ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      $('stato-serata').textContent = 'Salvato alle ' + ora + '.'
      if (!silenzioso) messaggio('Serata salvata.', 'ok')
      ultimoSalvato = JSON.stringify(d)
      return true
    }).catch(function () {
      if (!silenzioso) messaggio('Non sono riuscito a salvare. Controlla la connessione e riprova.', 'attenzione')
      return false
    })
  }

  function programmaSalvataggio() {
    clearTimeout(attesaSalva)
    attesaSalva = setTimeout(function () {
      if (JSON.stringify(leggiForm()) !== ultimoSalvato) salva(true)
    }, 4000)
  }

  function cambiato() {
    bozzaLocale(true)
    anteprima(600)
    programmaSalvataggio()
  }

  // ---------- scarico (con controlli: niente file se qualcosa non entra) ----------
  function scarica(tab) {
    var m = modelloDi(tab)
    var d = perDisegno(leggiForm())
    var canvas = document.createElement('canvas')
    return window.GRAFICHE_RENDER.disegna(canvas, m, d, { scala: 1 }).then(function () {
      var g = canvas.grafiche
      if (g.problemi.length || g.scala < g.minimo) throw new Error('non entra')
      return new Promise(function (ok, ko) {
        canvas.toBlob(function (blob) {
          if (!blob) { ko(new Error('troppo grande')); return }
          var a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'serata-' + ($('data').value || oggiIso()) + '-' + tab.file + '.png'
          document.body.appendChild(a)
          a.click()
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); ok() }, 1500)
        }, 'image/png')
      })
    })
  }

  function scaricaLista(lista) {
    var mancano = campiMancanti(leggiForm())
    if (mancano) {
      messaggio('Mancano ancora ' + mancano + ' campi (artisti, orario o titoli dei brani): le grafiche verrebbero con dei vuoti. Completali, poi scarica.', 'attenzione')
      return
    }
    $('scarica').disabled = $('scarica-questa').disabled = true
    messaggio('Preparo ' + (lista.length === 1 ? 'la grafica' : lista.length + ' grafiche') + ' in alta qualità… ci vuole un po’.')
    var errori = []
    lista.reduce(function (p, t) {
      return p.then(function () { return scarica(t) }).catch(function (e) { errori.push(t.nome + (e && e.message === 'non entra' ? ' (il testo non entra: accorcia o togli brani)' : '')) })
    }, Promise.resolve()).then(function () {
      $('scarica').disabled = $('scarica-questa').disabled = false
      if (errori.length) messaggio('Non scaricate: ' + errori.join('; ') + '. Sul telefono le più grandi (il ledwall) possono non riuscire: aprile dal computer del teatro.', 'attenzione')
      else messaggio('Fatto: trovi ' + lista.length + (lista.length === 1 ? ' file PNG' : ' file PNG') + ' tra i download.', 'ok')
      salva(true)
    })
  }

  // ---------- video (MP4) ----------
  function scaricaFile(blob, nome) {
    var a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = nome
    document.body.appendChild(a)
    a.click()
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 1500)
  }

  function scaricaVideo(tab, avanza) {
    var m = modelloDi(tab)
    var d = perDisegno(leggiForm())
    var prova = document.createElement('canvas')
    // Prima si controlla (in piccolo) che tutto il testo entri: se no, niente video.
    return window.GRAFICHE_RENDER.disegna(prova, m, d, { scala: 0.05 }).then(function () {
      var g = prova.grafiche
      if (g.problemi.length || g.scala < g.minimo) throw new Error('non entra')
      return window.GRAFICHE_VIDEO.creaVideo(m, d, { onProgresso: avanza })
    }).then(function (blob) { scaricaFile(blob, 'serata-' + ($('data').value || oggiIso()) + '-' + tab.file + '.mp4') })
  }

  function scaricaVideoLista(lista) {
    var conVideo = lista.filter(function (t) { return modelloDi(t).video })
    if (!conVideo.length) { messaggio('Per questa grafica c’è solo l’immagine PNG (il video c’è per gli schermi esterni).', 'attenzione'); return }
    if (!window.GRAFICHE_VIDEO.supportato()) { messaggio('Questo browser non sa preparare i video: usa Chrome o Edge dal computer. Le immagini PNG vanno bene ovunque.', 'attenzione'); return }
    var mancano = campiMancanti(leggiForm())
    if (mancano) { messaggio('Mancano ancora ' + mancano + ' campi (artisti, orario o titoli dei brani). Completali, poi scarica.', 'attenzione'); return }
    var barra = $('avanzamento')
    barra.hidden = false
    barra.value = 0
    $('video-tutti').disabled = $('video-questo').disabled = true
    var errori = []
    conVideo.reduce(function (p, t, i) {
      return p.then(function () {
        messaggio('Preparo il video «' + t.nome + '» (' + (i + 1) + ' di ' + conVideo.length + ')… tieni aperta la pagina.')
        return scaricaVideo(t, function (f) { barra.value = f })
      }).catch(function (e) {
        errori.push(t.nome + (e && e.message === 'non entra' ? ' (il testo non entra: accorcia o togli brani)' : e && e.message ? ' (' + e.message + ')' : ''))
      })
    }, Promise.resolve()).then(function () {
      barra.hidden = true
      $('video-tutti').disabled = $('video-questo').disabled = false
      if (errori.length) messaggio('Video non riusciti: ' + errori.join('; ') + '.', 'attenzione')
      else messaggio('Fatto: ' + conVideo.length + (conVideo.length === 1 ? ' video MP4 tra i download.' : ' video MP4 tra i download.'), 'ok')
      salva(true)
    })
  }

  // ---------- completamento dal repertorio ----------
  function completaDalRepertorio(e) {
    var t = e.target
    if (!t.classList || !t.classList.contains('titolo')) return
    var voce = (window.GRAFICHE_REPERTORIO || []).filter(function (r) { return r.titolo.toLowerCase() === t.value.trim().toLowerCase() })[0]
    if (!voce) return
    var scheda = t.closest('.voce')
    var opera = scheda.querySelector('.opera')
    var autore = scheda.querySelector('.autore')
    if (!opera.value.trim()) opera.value = voce.opera
    if (!autore.value.trim()) autore.value = voce.autore
    t.value = voce.titolo
  }

  function compila() {
    var testo = $('incolla').value
    var voci = T.leggiProgramma(testo)
    var brani = voci.filter(function (v) { return v.tipo === 'brano' }).length
    if (!brani) { messaggio('Non ho trovato brani in quel testo. Incolla il programma così come è arrivato.', 'attenzione'); return }
    voci.forEach(function (v) { if (v.tipo === 'brano') v.autore = T.autore(v.autore) })
    scriviVoci(voci)
    $('incolla-box').open = false
    messaggio('Programma compilato: ' + brani + ' brani. Controlla l’elenco qui sotto e sposta quello che serve.', 'ok')
    cambiato()
  }

  function dataCambiata() {
    var data = $('data').value
    if (!data) return
    caricando = true
    chiamata('grafiche_leggi', { chiave: chiave, la_data: data }).then(function (r) {
      caricando = false
      if (!r) { mostraConferma('bozza'); quandoDaData(); $('stato-serata').textContent = 'Serata nuova: i campi che vedi restano, cambia quello che serve.'; cambiato(); return }
      scriviForm(r.dati)
      ultimoSalvato = JSON.stringify(leggiForm())
      mostraConferma(r.stato, r.confermata_il, r.confermata_da)
      var q = new Date(r.aggiornato_il)
      $('stato-serata').textContent = 'Serata già salvata' + (r.autore ? ' da ' + r.autore : '') + ' (' +
        q.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' ' + q.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + ').'
      anteprima(0)
    }).catch(function () { caricando = false })
  }

  // ---------- avvio ----------
  function errore(testo) {
    $('contenuto').hidden = true
    var e = $('errore')
    e.hidden = false
    e.textContent = testo
  }

  function avvia() {
    if (!chiave) { errore('Questo indirizzo non è completo: usa il link che ti ha mandato Osaid (finisce con un codice lungo dopo il simbolo #).'); return }
    elenco = $('elenco')
    preparaListe()
    $('contenuto').hidden = false
    try { $('chisei').value = localStorage.getItem('grafiche-chisei') || '' } catch (e) {}

    chiamata('grafiche_elenco', { chiave: chiave }).then(function (lista) {
      var bozza = bozzaLocale(false)
      if (dataDaLink) {
        $('data').value = dataDaLink
        scriviForm({})
        dataCambiata()
      } else if (bozza && bozza.dati) {
        $('data').value = bozza.data || oggiIso()
        scriviForm(bozza.dati)
        if (bozza.chi && !$('chisei').value) $('chisei').value = bozza.chi
        $('stato-serata').textContent = 'Ho ripreso quello che stavi scrivendo.'
      } else if (lista.length) {
        // Punto di partenza: l'ultima serata salvata, con il giorno di oggi.
        return chiamata('grafiche_leggi', { chiave: chiave, la_data: lista[0].data }).then(function (r) {
          $('data').value = oggiIso()
          scriviForm(r ? r.dati : {})
          $('stato-serata').textContent = 'Parto dall’ultima serata salvata (' + lista[0].data.split('-').reverse().join('/') + '): cambia quello che serve.'
        })
      } else {
        $('data').value = oggiIso()
        scriviForm({})
        quandoDaData()
      }
    }).then(function () {
      aggiornaTab()
      anteprima(0)
    }).catch(function (e) {
      errore(e && e.message === 'chiave' ? 'Il link non è valido o è stato cambiato. Chiedi a Osaid di rimandartelo.' : 'Non riesco a collegarmi. Controlla la connessione e riapri la pagina.')
    })

    document.addEventListener('input', function (e) {
      if (e.target.id === 'data' || e.target.id === 'incolla') return
      if (e.target.id === 'chisei') { try { localStorage.setItem('grafiche-chisei', e.target.value) } catch (x) {} }
      completaDalRepertorio(e)
      cambiato()
    })
    document.addEventListener('change', function (e) { if (e.target.id === 'data' || e.target.id === 'incolla') return; completaDalRepertorio(e); cambiato() })
    $('data').addEventListener('change', dataCambiata)
    $('nuovo-brano').addEventListener('click', function () { var v = creaVoce({ tipo: 'brano' }); elenco.appendChild(v); rinumera(); v.querySelector('.titolo').focus(); cambiato() })
    $('nuovo-solo').addEventListener('click', function () { var v = creaVoce({ tipo: 'solo' }); elenco.appendChild(v); cambiato() })
    $('compila').addEventListener('click', compila)
    $('scarica').addEventListener('click', function () { scaricaLista(TABS) })
    $('scarica-questa').addEventListener('click', function () { scaricaLista([tabAttuale()]) })
    $('video-tutti').addEventListener('click', function () { scaricaVideoLista(TABS) })
    $('video-questo').addEventListener('click', function () { scaricaVideoLista([tabAttuale()]) })
    $('salva').addEventListener('click', function () { salva(false) })
    $('conferma').addEventListener('click', conferma)
  }

  avvia()
})()

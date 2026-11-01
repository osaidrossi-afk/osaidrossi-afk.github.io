// Misure dei modelli: prese una per una dai template Canva di Almagreal (30 ottobre 2026): posizione, larghezza, corpo, interlinea e
// spaziatura di ogni testo. Il logo, «Teatro Nazionale», gli ornamenti (putti e note) stanno già nello sfondo esportato da Canva;
// qui si disegnano solo i testi che cambiano ogni sera (nomi, programma, orario).
// Il programma è un elenco libero (brani, pezzi solo per pianoforte, intervallo): i testi si rimpiccioliscono da soli,
// tutti insieme e sempre con gli stessi font, finché ogni colonna sta nello spazio disponibile.
(function (global) {
  var BIANCO = '#ffffff'
  var ROSSO = '#9b0706'
  var T = global.GRAFICHE_TESTI
  var SCALA_MIN = 0.5 // sotto questa dimensione si avverte che i testi sono troppo piccoli
  var MARGINE = 0.012 // come render.js: il testo non si avvicina al bordo più di 12 millesimi della larghezza

  // «Tonight» (stasera) o «Tomorrow» (domani, per le grafiche messe il giorno prima).
  function quando(d) { return d.quando === 'Tomorrow' ? 'Tomorrow' : 'Tonight' }

  // Ruoli bilingue come nei template: «Soprano / Soprano», «Baritono / Baritone»…
  var RUOLI = { Soprano: 'Soprano', Tenor: 'Tenore', Baritone: 'Baritono', 'Bass-baritone': 'Basso-baritono', Bass: 'Basso', 'Mezzo-soprano': 'Mezzosoprano', Countertenor: 'Controtenore' }

  function riga(f, size, color, t, lh, ls) {
    var r = { run: { t: t, f: f, size: size, color: color } }
    if (lh != null) r.lh = lh
    if (ls != null) r.ls = ls
    return r
  }

  // Una riga con due stili sulla stessa linea di base (es. ruolo in grassetto + ruolo inglese in corsivo).
  function riga2(parti, lh) {
    var r = { run: parti[0], parts: parti }
    if (lh != null) r.lh = lh
    return r
  }

  function conStrato(r, nome) { r.strato = nome; return r }

  function artisti(d) {
    var r2 = d.ruolo2 || 'Baritone'
    return [
      { it: 'Soprano', en: 'Soprano', nome: d.soprano },
      { it: d.ruoloIt || RUOLI[r2] || r2, en: r2, nome: d.voce2 },
      { it: 'Piano', en: 'Piano', nome: d.pianista },
    ]
  }

  function larghezzaRiga(ctx, ln, ls) {
    var R = global.GRAFICHE_RENDER
    var parti = ln.parts || [ln.run]
    var w = 0
    parti.forEach(function (p) { w += R.larghezza(ctx, p, p.t, ls) })
    return w
  }

  // Nomi degli artisti, uno sotto l'altro (come nei template): ruolo («Soprano / Soprano») e sotto il nome.
  // cfg = {left, top, width, align, lh, ls, ruolo, nome, sep} (misure di Canva, già per la dimensione della grafica).
  // Se una riga non entra nel riquadro, tutto il blocco si rimpicciolisce (stessi font) finché entra.
  function nomi(d, ctx, cfg) {
    var lista = artisti(d)
    var costruisci = function (k) {
      var lines = []
      lista.forEach(function (a, i) {
        lines.push(conStrato(riga2([
          { t: a.it + ' / ', f: 'serifb', size: cfg.ruolo * k, color: BIANCO },
          { t: a.en, f: 'serifi', size: cfg.ruolo * k, color: BIANCO },
        ]), 'r' + (i + 1)))
        lines.push(conStrato(riga('sansb', cfg.nome * k, ROSSO, a.nome), 'n' + (i + 1)))
        if (i < lista.length - 1) lines.push(riga('serifb', cfg.sep * k, BIANCO, ''))
      })
      return lines
    }
    var massima = 0
    costruisci(1).forEach(function (ln) { if (ln.parts || ln.run.t) massima = Math.max(massima, larghezzaRiga(ctx, ln, cfg.ls || 0)) })
    // (in Canva il riquadro è largo quanto la riga più lunga: si rimpicciolisce solo se la riga è più larga)
    var k = massima > cfg.width * 1.01 ? Math.max(0.6, (cfg.width * 1.01) / massima) : 1
    return { nome: 'nomi', left: cfg.left, top: cfg.top, width: cfg.width, align: cfg.align || 'center', lh: cfg.lh, ls: cfg.ls, lines: costruisci(k) }
  }

  // ---------- programma ----------
  // Una voce dell'elenco → righe. st = {titolo, piccolo} (corpi base), k = riduzione.
  function voceRighe(v, st, k) {
    var t = st.titolo * k, p = st.piccolo * k
    var vuota = riga('sans', p * (st.vuoto || 1), ROSSO, '')
    if (v.tipo === 'intervallo') return [riga('sansb', p, ROSSO, '— Interval Drink —'), riga('sans', p, ROSSO, 'Jazz Bar Open'), vuota]
    if (v.tipo === 'solo') {
      var testo = String(v.testo || 'Piano Solo').split('\n').map(function (x) { return x.trim() }).filter(Boolean)
      var out = []
      if (testo.length <= 1) out.push(riga('sansb', p, ROSSO, '- ' + (testo[0] || 'Piano Solo') + ' -'))
      else testo.forEach(function (x) { out.push(riga('sansb', p, ROSSO, x)) })
      out.push(vuota)
      return out
    }
    var out2 = [riga('serifb', t, BIANCO, T.titolo(v.titolo))]
    var opera = String(v.opera || '').trim()
    var aut = T.autore(v.autore)
    if (opera) out2.push(riga('sansb', p, ROSSO, opera))
    if (aut) out2.push(riga('sans', p, ROSSO, 'By ' + aut))
    out2.push(vuota)
    return out2
  }

  // Divide le voci in n colonne di altezza il più possibile uguale, senza cambiare l'ordine (h = altezze).
  function dividiFlusso(h, n) {
    var m = h.length
    var gruppi = []
    if (m <= n) { for (var i0 = 0; i0 < n; i0++) gruppi.push(i0 < m ? [i0] : []); return gruppi }
    var pre = [0]
    h.forEach(function (x) { pre.push(pre[pre.length - 1] + x) })
    var INF = 1e18
    var dp = [], dove = []
    for (var j = 0; j <= n; j++) { dp.push(new Array(m + 1).fill(INF)); dove.push(new Array(m + 1).fill(0)) }
    dp[0][0] = 0
    for (var jj = 1; jj <= n; jj++) {
      for (var i = 0; i <= m; i++) {
        for (var t = 0; t <= i; t++) {
          if (dp[jj - 1][t] >= INF) continue
          var costo = Math.max(dp[jj - 1][t], pre[i] - pre[t])
          if (costo < dp[jj][i]) { dp[jj][i] = costo; dove[jj][i] = t }
        }
      }
    }
    var fine = m
    for (var q = n; q >= 1; q--) {
      var inizio = dove[q][fine]
      var g = []
      for (var x = inizio; x < fine; x++) g.push(x)
      gruppi.unshift(g)
      fine = inizio
    }
    return gruppi
  }

  function da(a, b) { var o = []; for (var i = a; i < b; i++) o.push(i); return o }

  // Prova la dimensione piena e poi sempre più piccola finché tutte le colonne stanno nello spazio.
  // cfg = {larghezza, st:{titolo,piccolo}, ls, align, colonne:[{left,width,top,maxY}], modo:'intervallo'|'flusso', nomi:[nomi colonne]}
  //   modo 'intervallo': a sinistra quello che sta prima dell'intervallo, a destra l'intervallo e il resto (due colonne, schermi esterni);
  //   modo 'flusso': le voci scorrono nelle colonne, che si bilanciano da sole (ledwall e schermi interni).
  function programma(d, ctx, cfg) {
    var R = global.GRAFICHE_RENDER
    var voci = d.voci || []
    var margine = cfg.larghezza * MARGINE
    var n = cfg.colonne.length
    var scala = 1
    var blocchi
    for (; scala >= 0.3; scala -= 0.01) {
      var items = voci.map(function (v) { return voceRighe(v, cfg.st, scala) })
      var gruppi
      if (cfg.modo === 'intervallo') {
        var i = voci.findIndex(function (v) { return v.tipo === 'intervallo' })
        if (i < 0) i = voci.length
        gruppi = [da(0, i), da(i, voci.length)]
      } else {
        var alte = items.map(function (righe) {
          return R.impagina(ctx, { left: 0, top: 0, width: cfg.colonne[0].width, align: cfg.align, lh: 1, ls: cfg.ls, lines: righe }).alto
        })
        gruppi = dividiFlusso(alte, n)
      }
      blocchi = cfg.colonne.map(function (col, c) {
        var lines = []
        // ogni voce è uno «strato» a sé: nel video entrano una dopo l'altra
        ;(gruppi[c] || []).forEach(function (ix) {
          items[ix].forEach(function (l) { l.strato = 'v' + ix })
          lines = lines.concat(items[ix])
        })
        return { nome: cfg.nomi[c], left: col.left, top: col.top, width: col.width, align: cfg.align, lh: 1, ls: cfg.ls, maxY: col.maxY, lines: lines }
      })
      var entra = blocchi.every(function (b) {
        var r = R.impagina(ctx, b)
        return r.fine <= b.maxY && (!r.righe.length || (r.xMin >= margine && r.xMax <= cfg.larghezza - margine))
      })
      if (entra) break
    }
    blocchi.info = { scala: Math.round(scala * 100) / 100, minimo: SCALA_MIN }
    return blocchi
  }

  function con(testa, b) {
    var tutti = testa.concat(b)
    tutti.info = b.info
    return tutti
  }

  // ---------- Animazioni d'entrata (solo video per gli schermi esterni) ----------
  // Gli sfondi di Almagreal sono fermi (nessuna animazione nei template), quindi l'entrata è disegnata qui, lenta e leggera, e poi tutto resta fermo:
  //  1. lo sfondo (logo, putto) compare con una dissolvenza mentre l'intera scena si assesta con un lento zoom indietro (la «macchina da presa»);
  //  2. le note musicali entrano una per una, ruotando appena e con un piccolo rimbalzo, come se la musica cominciasse;
  //  3. i testi arrivano nell'ordine in cui si leggono: dissolvenza, sfocatura che si schiarisce e una lieve salita dal basso.
  var FACILI = {
    uscita: function (u) { return 1 - Math.pow(1 - u, 3) }, // parte decisa e si ferma piano
    lenta: function (u) { return 1 - Math.pow(1 - u, 4) }, // ancora più dolce alla fine
    rimbalzo: function (u) { var c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2) }, // supera di poco e torna
  }
  // Curva da v0 (fino a t0) a v1 (da t1 in poi), con il tipo di morbidezza scelto.
  function rampa(t0, t1, v0, v1, facile) {
    var f = FACILI[facile || 'uscita']
    var punti = []
    for (var i = 0; i <= 24; i++) { var u = i / 24; punti.push([t0 + (t1 - t0) * u, v0 + (v1 - v0) * f(u)]) }
    return punti
  }
  function entra(t0, durata) {
    return { tipo: 'dissolvenza', alfa: rampa(t0, t0 + durata, 0, 1), sfoca: rampa(t0, t0 + durata, 14, 0), dy: rampa(t0, t0 + durata * 1.15, 34, 0) }
  }
  function nota(t0) {
    return { alfa: rampa(t0, t0 + 0.7, 0, 1), scala: rampa(t0, t0 + 0.95, 0.45, 1, 'rimbalzo'), rot: rampa(t0, t0 + 1.05, -16, 0, 'rimbalzo'), dy: rampa(t0, t0 + 1.1, 70, 0) }
  }
  var SFONDO_COLORE = '#e99d25' // il colore di fondo dei template (233, 157, 37)
  var CAMERA = { scala: rampa(0, 7, 1.05, 1, 'lenta') }
  var FONDO = { alfa: rampa(0, 1.6, 0, 1) }
  var TEMPO = { durata: 15, fine: 7.2 } // l'entrata finisce entro 7 secondi; poi l'immagine resta ferma fino a 15

  // Posizioni delle note (in px della grafica) separate dallo sfondo con crea_note: plate/video/*.png
  var NOTE_NOMI = [[171, 1275, 215, 357, 3], [1776, 1920, 168, 280, 2], [216, 2929, 336, 413, 1], [1647, 3000, 298, 496, 4]]
  var NOTE_PROGRAMMA = [[192, 888, 145, 241, 1], [1811, 1453, 203, 339, 3], [1572, 3137, 323, 395, 2]]
  function livelliNote(nome, elenco, partenza) {
    return elenco.map(function (n, i) { return { src: 'plate/video/' + nome + '-n' + n[4] + '.png', x: n[0], y: n[1], w: n[2], h: n[3], anim: nota(partenza + i * 0.36) } })
  }

  var K = 2 // i template esterni e interni sono 1080×1920 e 1920×1080: si disegna al doppio (2160×3840 e 3840×2160)
  var ESTERNI = { titolo: 40 * K, piccolo: 28 * K }
  var INTERNI = { titolo: 36.8919 * K, piccolo: 25.8245 * K }
  var LEDWALL = { titolo: 108, piccolo: 76, vuoto: 0.55 } // un po' più grandi del template (96 e 67): sul ledwall si leggono da lontano

  var MODELLI = {
    // Schermi esterni, verticali 2160x3840 — nomi
    'esterni-artisti': {
      w: 2160, h: 3840, plate: 'plate/esterni-nomi.png',
      video: { plate: 'plate/video/esterni-nomi-fondo.png', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, sfondoColore: SFONDO_COLORE, camera: CAMERA, fondo: FONDO,
        livelli: livelliNote('esterni-nomi', NOTE_NOMI, 1.0),
        // gli artisti uno dopo l'altro: prima il ruolo, un attimo dopo il nome
        anim: function (strati) {
          var T = { r1: 2.0, n1: 2.45, r2: 3.3, n2: 3.75, r3: 4.6, n3: 5.05 }
          var m = {}
          strati.forEach(function (st) { var c = st.nome.split(':')[1]; if (T[c] != null) m[st.nome] = entra(T[c], 1.5) })
          return m
        } },
      blocchi: function (d, ctx) {
        return [nomi(d, ctx, { left: 215.1328 * K, top: 552.4221 * K, width: 649.7344 * K, lh: 1.13, ls: 0.026, ruolo: 66.6667 * K, nome: 49.5666 * K, sep: 72.8915 * K })]
      },
    },
    // Schermi esterni — programma: «CONCERT PROGRAM / TONIGHT 20.30» e due colonne (l'intervallo apre la colonna di destra)
    'esterni-programma': {
      w: 2160, h: 3840, plate: 'plate/esterni-prog.png',
      video: { plate: 'plate/video/esterni-prog-fondo.png', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, sfondoColore: SFONDO_COLORE, camera: CAMERA, fondo: FONDO,
        livelli: livelliNote('esterni-prog', NOTE_PROGRAMMA, 1.0),
        // prima «CONCERT PROGRAM» e l'orario, poi i brani a cascata dall'alto, le due colonne quasi insieme (la destra un attimo dopo)
        anim: function (strati) {
          var m = {}
          var per = {}
          strati.forEach(function (st) { var p = st.nome.split(':'); if (p[1] && p[1].charAt(0) === 'v') per[p[0]] = (per[p[0]] || 0) + 1 })
          var piu = Math.max(1, Math.max.apply(null, Object.keys(per).map(function (c) { return per[c] }).concat([1])))
          var passo = piu > 1 ? Math.min(0.3, 2.4 / (piu - 1)) : 0.3
          var contati = {}
          strati.forEach(function (st) {
            var p = st.nome.split(':')
            if (p[0] === 'titolo') m[st.nome] = entra(p[1] === 't2' ? 2.4 : 1.9, 1.4)
            else if (p[1] && p[1].charAt(0) === 'v') {
              var j = contati[p[0]] || 0
              contati[p[0]] = j + 1
              m[st.nome] = entra((p[0] === 'programma di destra' ? 3.3 : 3.0) + j * passo, 1.3)
            }
          })
          return m
        } },
      blocchi: function (d, ctx) {
        var b = programma(d, ctx, { larghezza: 2160, st: ESTERNI, ls: 0.039, align: 'start', modo: 'intervallo',
          nomi: ['programma di sinistra', 'programma di destra'],
          colonne: [{ left: 132.3465 * K, width: 398.6808 * K, top: 775.9668 * K, maxY: 1775 * K }, { left: 564.3465 * K, width: 383.307 * K, top: 775.9668 * K, maxY: 1550 * K }] })
        return con([
          { nome: 'titolo', left: 116.1499 * K, top: 594.7872 * K, width: 847.7002 * K, align: 'center', lh: 1.05, ls: 0, lines: [
            conStrato(riga('sansb', 70.987 * K, BIANCO, 'CONCERT PROGRAM'), 't1'),
            conStrato(riga('sans', 46.2175 * K, BIANCO, quando(d).toUpperCase() + ' ' + d.orario, 1.09, 0.03), 't2'),
          ] },
        ], b)
      },
    },
    // Tappo per il ledwall (4224x4320): in una grafica sola i nomi degli artisti e il programma (in tre colonne)
    'ledwall-programma': {
      w: 4224, h: 4320, plate: 'plate/ledwall.png',
      blocchi: function (d, ctx) {
        var R = global.GRAFICHE_RENDER
        var lista = artisti(d)
        // Gli artisti, uno per riga (ruolo bilingue in bianco + nome in rosso sulla stessa linea): sul ledwall si leggono da lontano, quindi grandi.
        // Tutti con lo stesso corpo, ridotto solo se la riga più lunga non entra nella larghezza disponibile.
        var larg = 2900, ruolo = 132, nome = 120, k = 1, massima = 0
        function parti(a, kk) {
          return [{ t: a.it + ' / ', f: 'serifb', size: ruolo * kk, color: BIANCO }, { t: a.en, f: 'serifi', size: ruolo * kk, color: BIANCO },
            { t: '   ' + a.nome, f: 'sansb', size: nome * kk, color: ROSSO }]
        }
        lista.forEach(function (a) {
          var w = 0
          parti(a, 1).forEach(function (p) { w += R.larghezza(ctx, p, p.t, 0.026) })
          massima = Math.max(massima, w)
        })
        if (massima > larg) k = Math.max(0.6, larg / massima)
        var blocchiNomi = lista.map(function (a, i) {
          return { nome: 'nomi:' + (i + 1), left: 2112 - larg / 2, top: 1235 + i * 146 * k, width: larg, align: 'center', lh: 1.13, ls: 0.026, lines: [riga2(parti(a, k))] }
        })
        var b = programma(d, ctx, { larghezza: 4224, st: LEDWALL, ls: 0.039, align: 'center', modo: 'flusso',
          nomi: ['programma 1', 'programma 2', 'programma 3'],
          colonne: [{ left: 692.0318, width: 958.972, top: 1930, maxY: 3230 }, { left: 1651.0038, width: 958.972, top: 1930, maxY: 3470 }, { left: 2609.9759, width: 921.9923, top: 1930, maxY: 3230 }] })
        return con(blocchiNomi.concat([
          { nome: 'titolo', left: 1112, top: 1745, width: 2000, align: 'center', lh: 1.05, ls: 0, lines: [riga('sansb', 112, BIANCO, 'CONCERT PROGRAM')] },
        ]), b)
      },
    },
    // Schermi interni, 16:9 (3840x2160) — nomi
    'wide-artisti': {
      w: 3840, h: 2160, plate: 'plate/interni-nomi.png',
      blocchi: function (d, ctx) {
        return [nomi(d, ctx, { left: 709.7185 * K, top: 415.4998 * K, width: 500.5631 * K, lh: 1.13, ls: 0.026, ruolo: 51.3606 * K, nome: 38.1867 * K, sep: 56.1565 * K })]
      },
    },
    // Schermi interni — programma in quattro colonne
    'wide-programma': {
      w: 3840, h: 2160, plate: 'plate/interni-prog.png',
      blocchi: function (d, ctx) {
        var b = programma(d, ctx, { larghezza: 3840, st: INTERNI, ls: 0.039, align: 'start', modo: 'flusso',
          nomi: ['programma 1', 'programma 2', 'programma 3', 'programma 4'],
          colonne: [284.5658, 622.3, 960, 1297.7].map(function (x, i) { return { left: x * K, width: 313.7 * K, top: 463.3475 * K, maxY: (i === 1 || i === 2 ? 925 : 905) * K } }) })
        return con([
          { nome: 'titolo', left: 509.2817 * K, top: 332.6042 * K, width: 901.4367 * K, align: 'center', lh: 1.05, ls: 0, lines: [
            riga2([{ t: 'CONCERT PROGRAM | ', f: 'sansb', size: 50.6954 * K, color: BIANCO }, { t: quando(d).toUpperCase() + ' ' + d.orario, f: 'sans', size: 50.6954 * K, color: BIANCO }], 1.05),
          ] },
        ], b)
      },
    },
  }

  // ---------- Locandine con foto ----------
  // Template orizzontali di Almagreal per i monitor (1921×1080): a sinistra logo, data e ora, a destra un riquadro quadrato per la foto.
  // Nella data, i suffissi dopo le cifre («th» in «19th», «pm» in «8:00pm») sono piccoli e rialzati, come nel template.
  function partiData(testo, size, color) {
    var parti = []
    var re = /(\d)(st|nd|rd|th|am|pm)\b/gi
    var ultimo = 0, m
    while ((m = re.exec(testo)) !== null) {
      var fine = m.index + 1
      parti.push({ t: testo.slice(ultimo, fine), f: 'sans', size: size, color: color })
      parti.push({ t: m[2], f: 'sans', size: size * 0.6, color: color, rialzo: 0.38 })
      ultimo = fine + m[2].length
    }
    parti.push({ t: testo.slice(ultimo), f: 'sans', size: size, color: color })
    var utili = parti.filter(function (p) { return p.t })
    return utili.length ? utili : [{ t: ' ', f: 'sans', size: size, color: color }]
  }

  function locandina(plate, colore) {
    return {
      w: 3840, h: 2160, plate: plate,
      foto: [{ x: 960.5 * K, y: 91.7817 * K, w: 896.4366 * K, h: 896.4366 * K }],
      blocchi: function (d) {
        return [{ nome: 'data', left: (475.77 - 400) * K, top: 60 * K, width: 800 * K, align: 'center', lh: 1.4, ls: 0,
          lines: [riga2(partiData(d.testoData || '', 40 * K, colore), 1.4)] }]
      },
    }
  }
  MODELLI['locandina-voci'] = locandina('plate/locandina-voci.png', '#9c0d08')
  MODELLI['locandina-btc'] = locandina('plate/locandina-btc.png', '#130a80')

  global.GRAFICHE_MODELLI = MODELLI
})(window)

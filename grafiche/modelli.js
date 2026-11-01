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
        ]), 'a' + (i + 1)))
        lines.push(conStrato(riga('sansb', cfg.nome * k, ROSSO, a.nome), 'a' + (i + 1)))
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
    var vuota = riga('sans', p, ROSSO, '')
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
        ;(gruppi[c] || []).forEach(function (ix) { lines = lines.concat(items[ix]) })
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

  // Animazioni dei testi (solo video per gli schermi esterni): ogni testo compare con una dissolvenza e un po' di sfocatura che si
  // schiarisce. Gli sfondi dei template di Almagreal sono fermi, quindi l'unico movimento sono i testi.
  function sfoca(a, b) { return [[0, 22], [a, 22], [(a + b) / 2, 9], [b, 0]] }
  function diss(a, b) { return { tipo: 'dissolvenza', alfa: [[0, 0], [a, 0], [b, 1]], sfoca: sfoca(a, b) } }
  var TEMPO = { durata: 15, fine: 2.6 }

  var K = 2 // i template esterni e interni sono 1080×1920 e 1920×1080: si disegna al doppio (2160×3840 e 3840×2160)
  var ESTERNI = { titolo: 40 * K, piccolo: 28 * K }
  var INTERNI = { titolo: 36.8919 * K, piccolo: 25.8245 * K }
  var LEDWALL = { titolo: 96.2138, piccolo: 67.3502 }

  var MODELLI = {
    // Schermi esterni, verticali 2160x3840 — nomi
    'esterni-artisti': {
      w: 2160, h: 3840, plate: 'plate/esterni-nomi.png',
      video: { plate: 'plate/esterni-nomi.png', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, anim: {
        'nomi:a1': diss(0.3, 1.3), 'nomi:a2': diss(0.8, 1.8), 'nomi:a3': diss(1.3, 2.3),
      } },
      blocchi: function (d, ctx) {
        return [nomi(d, ctx, { left: 215.1328 * K, top: 552.4221 * K, width: 649.7344 * K, lh: 1.13, ls: 0.026, ruolo: 66.6667 * K, nome: 49.5666 * K, sep: 72.8915 * K })]
      },
    },
    // Schermi esterni — programma: «CONCERT PROGRAM / TONIGHT 20.30» e due colonne (l'intervallo apre la colonna di destra)
    'esterni-programma': {
      w: 2160, h: 3840, plate: 'plate/esterni-prog.png',
      video: { plate: 'plate/esterni-prog.png', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, anim: {
        titolo: diss(0.2, 1.1), 'programma di sinistra': diss(0.8, 1.9), 'programma di destra': diss(1.2, 2.3),
      } },
      blocchi: function (d, ctx) {
        var b = programma(d, ctx, { larghezza: 2160, st: ESTERNI, ls: 0.039, align: 'start', modo: 'intervallo',
          nomi: ['programma di sinistra', 'programma di destra'],
          colonne: [{ left: 132.3465 * K, width: 398.6808 * K, top: 775.9668 * K, maxY: 1775 * K }, { left: 564.3465 * K, width: 383.307 * K, top: 775.9668 * K, maxY: 1550 * K }] })
        return con([
          { nome: 'titolo', left: 116.1499 * K, top: 594.7872 * K, width: 847.7002 * K, align: 'center', lh: 1.05, ls: 0, lines: [
            riga('sansb', 70.987 * K, BIANCO, 'CONCERT PROGRAM'),
            riga('sans', 46.2175 * K, BIANCO, quando(d).toUpperCase() + ' ' + d.orario, 1.09, 0.03),
          ] },
        ], b)
      },
    },
    // Tappo per il ledwall (4224x4320): in una grafica sola i nomi degli artisti e il programma (in tre colonne)
    'ledwall-programma': {
      w: 4224, h: 4320, plate: 'plate/ledwall.png',
      blocchi: function (d, ctx) {
        var R = global.GRAFICHE_RENDER
        var centri = [1171.5, 2130.5, 3071]
        var larg = 940
        var lista = artisti(d)
        // I nomi in tre colonne, sopra il programma: tutti con lo stesso corpo, ridotto se la riga più lunga non entra.
        var ruolo = 104, nome = 78, k = 1, massima = 0
        lista.forEach(function (a) {
          massima = Math.max(massima, R.larghezza(ctx, { f: 'serifb', size: ruolo, t: a.it + ' / ' }, a.it + ' / ', 0.026) + R.larghezza(ctx, { f: 'serifi', size: ruolo, t: a.en }, a.en, 0.026))
        })
        if (massima > larg) k = Math.max(0.6, larg / massima)
        var blocchiNomi = lista.map(function (a, i) {
          return { nome: 'nomi:' + (i + 1), left: centri[i] - larg / 2, top: 1290, width: larg, align: 'center', lh: 1.13, ls: 0.026, lines: [
            riga2([{ t: a.it + ' / ', f: 'serifb', size: ruolo * k, color: BIANCO }, { t: a.en, f: 'serifi', size: ruolo * k, color: BIANCO }]),
            riga('sansb', nome * k, ROSSO, a.nome),
          ] }
        })
        var b = programma(d, ctx, { larghezza: 4224, st: LEDWALL, ls: 0.039, align: 'center', modo: 'flusso',
          nomi: ['programma 1', 'programma 2', 'programma 3'],
          colonne: [{ left: 692.0318, width: 958.972, top: 1790, maxY: 3230 }, { left: 1651.0038, width: 958.972, top: 1790, maxY: 3470 }, { left: 2609.9759, width: 921.9923, top: 1790, maxY: 3230 }] })
        return con(blocchiNomi.concat([
          { nome: 'titolo', left: 1112, top: 1545, width: 2000, align: 'center', lh: 1.05, ls: 0, lines: [riga('sansb', 112, BIANCO, 'CONCERT PROGRAM')] },
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

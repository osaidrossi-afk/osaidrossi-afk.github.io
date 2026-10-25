// Misure dei modelli: prese una per una dai design Canva di Osaid (posizione, larghezza, corpo, interlinea, spaziatura, ombre).
// I testi fissi (logo, «Teatro Nazionale», «Voci d'Italia», QR…) stanno già nello sfondo esportato da Canva.
// Il programma è un elenco libero (brani, pezzi solo per pianoforte, intervallo): i testi si rimpiccioliscono da soli,
// tutti insieme e sempre con gli stessi font, finché ogni colonna sta nello spazio disponibile.
(function (global) {
  var BIANCO = '#ffffff'
  var ORO = '#d7a95a'
  var T = global.GRAFICHE_TESTI

  // Ombre (misurate sugli originali di Canva; crescono con il corpo del testo)
  var OMBRA_NOMI = { dx: 7, dy: 6, blur: 10, a: 0.93 }
  var OMBRA_PROG = { dx: 11, dy: 7, blur: 14, a: 0.92 }
  var OMBRA_TITOLO = { dx: 4, dy: 2, blur: 16, a: 0.49 }
  var OMBRA_LEDWALL = { dx: 16, dy: 11, blur: 20, a: 0.94 }
  var OMBRA_ARTISTI_B = { dx: 8.5, dy: 7.7, blur: 10, a: 0.88 }
  var OMBRA_WIDE = { dx: 9, dy: 7, blur: 10, a: 0.9 }
  var K_LEDWALL = 1.4052
  var SCALA_MIN = 0.5 // sotto questa dimensione si avverte che i testi sono troppo piccoli

  // «Tonight» (stasera) o «Tomorrow» (domani, per le grafiche messe il giorno prima).
  function quando(d) { return d.quando === 'Tomorrow' ? 'Tomorrow' : 'Tonight' }

  // Il video dura 15 secondi: l'animazione di ENTRATA come in Canva (5 s), poi l'immagine resta ferma. Niente uscite.
  var TEMPO = { durata: 15, fine: 4.97 }

  function riga(f, size, color, t, lh, ls) {
    var r = { run: { t: t, f: f, size: size, color: color } }
    if (lh != null) r.lh = lh
    if (ls != null) r.ls = ls
    return r
  }

  function conStrato(r, nome) { r.strato = nome; return r }

  // Un brano: titolo (corsivo con svolazzi), opera o genere, autore, riga vuota. k = ingrandimento × riduzione.
  function brano(b, k) {
    var out = [riga('allura', 104.002 * k, BIANCO, T.titolo(b.titolo))]
    var opera = String(b.opera || '').trim()
    var aut = T.autore(b.autore)
    if (opera) out.push(riga('belleza', 88 * k, BIANCO, opera))
    if (aut) out.push(riga('radleyi', 85.4445 * k, ORO, 'By ' + aut))
    out.push(riga('radleyi', 85.4445 * k, BIANCO, ''))
    return out
  }
  function solo(v, k) {
    var righe = String(v.testo || 'Piano Solo').split('\n').map(function (x) { return x.trim() }).filter(Boolean)
    var out = []
    if (righe.length <= 1) out.push(riga('radleyi', 88.5379 * k, BIANCO, '- ' + (righe[0] || 'Piano Solo') + ' -'))
    else righe.forEach(function (x) { out.push(riga('radleyi', 88.5379 * k, BIANCO, x)) })
    out.push(riga('radleyi', 88.5379 * k, BIANCO, ''))
    return out
  }
  function elenco(voci, k) {
    var out = []
    voci.forEach(function (v) { out = out.concat(v.tipo === 'solo' ? solo(v, k) : brano(v, k)) })
    return out
  }
  function testataIntervallo(k) {
    return [riga('belleza', 88 * k, BIANCO, '— Interval Drink —'), riga('belleza', 88 * k, BIANCO, 'Jazz Bar Open'),
      riga('radleyi', 91.2549 * k, BIANCO, '')]
  }

  function artisti(d) {
    return ['Soprano - ' + d.soprano, d.ruolo2 + ' - ' + d.voce2, 'Piano - ' + d.pianista]
  }

  // Divide l'elenco in due colonne: prima dell'intervallo (sinistra) e dopo (destra, con «Interval Drink» in cima).
  function dividi(voci) {
    var i = voci.findIndex(function (v) { return v.tipo === 'intervallo' })
    if (i < 0) i = voci.length
    return { sx: voci.slice(0, i), dx: voci.slice(i + 1) }
  }

  // Larghezza utile di una colonna: il centro resta quello del design, ma il testo non si avvicina a meno di 40 px dal bordo.
  function utile(col, larghezza) {
    var c = col.left + col.width / 2
    var mezza = Math.min(col.width / 2, c - 40, larghezza - 40 - c)
    return { left: c - mezza, width: mezza * 2 }
  }

  // Nomi degli artisti: se una riga non entra nel riquadro, tutto il blocco si rimpicciolisce (stessi font) finché entra.
  function nomi(d, ctx, cfg) {
    var R = global.GRAFICHE_RENDER
    var testi = artisti(d)
    var k = 1
    var massima = 0
    testi.forEach(function (t) { massima = Math.max(massima, R.larghezza(ctx, { f: 'belleza', size: cfg.size, t: t }, t, cfg.ls || 0)) })
    if (massima > cfg.width * 0.98) k = Math.max(0.6, (cfg.width * 0.98) / massima)
    return { nome: 'nomi degli artisti', left: cfg.left, top: cfg.top, width: cfg.width, align: cfg.align, lh: cfg.lh, ls: cfg.ls, ombra: cfg.ombra,
      lines: testi.map(function (t) { return riga('belleza', cfg.size * k, BIANCO, t) }) }
  }

  // Prova la dimensione piena e poi sempre più piccola finché le due colonne stanno nello spazio.
  function programma(d, ctx, cfg) {
    var parti = dividi(d.voci || [])
    cfg = { k: cfg.k, ombra: cfg.ombra, larghezza: cfg.larghezza, sx: Object.assign({}, cfg.sx, utile(cfg.sx, cfg.larghezza)), dx: Object.assign({}, cfg.dx, utile(cfg.dx, cfg.larghezza)) }
    var R = global.GRAFICHE_RENDER
    var scala = 1
    var blocchi
    for (; scala >= 0.3; scala -= 0.01) {
      var k = cfg.k * scala
      blocchi = [
        { nome: 'programma di sinistra', left: cfg.sx.left, top: cfg.sx.top, width: cfg.sx.width, align: 'center', lh: 1, ls: 0.039, ombra: cfg.ombra, maxY: cfg.sx.maxY, lines: elenco(parti.sx, k) },
        { nome: 'programma di destra', left: cfg.dx.left, top: cfg.dx.top, width: cfg.dx.width, align: 'center', lh: 1, ls: 0.039, ombra: cfg.ombra, maxY: cfg.dx.maxY,
          lines: testataIntervallo(k).concat(elenco(parti.dx, k)) },
      ]
      var entra = blocchi.every(function (b) {
        var r = R.impagina(ctx, b)
        return r.fine <= b.maxY && (!r.righe.length || (r.xMin >= 0 && r.xMax <= cfg.larghezza))
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

  // Animazioni dei testi della serata, misurate sui video che Canva esporta dai design di Osaid.
  var SFOCA_NOMI = [[0, 30], [0.6, 28], [1.0, 25], [1.2, 18], [1.6, 18], [1.8, 13], [2.2, 13], [2.4, 9], [2.6, 9], [2.8, 6], [3.0, 4], [3.2, 4], [3.4, 2], [4.3, 2], [4.4, 0]]
  var SFOCA_ORARIO = [[0, 18], [1.6, 18], [1.8, 13], [2.0, 13], [2.2, 9], [2.4, 9], [2.6, 6], [2.8, 4], [3.0, 4], [3.2, 2], [4.3, 2], [4.4, 0]]

  var MODELLI = {
    // Schermi esterni, verticali 2160x3840 — nomi + orario
    'esterni-artisti': {
      w: 2160, h: 3840, plate: 'plate/esterni-artisti.jpg',
      video: { plate: 'plate/esterni-artisti.mp4', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, anim: {
        'nomi degli artisti': { tipo: 'dissolvenza', alfa: [[0, 0], [0.5, 0], [2.0, 1]], sfoca: SFOCA_NOMI },
        'orario': { tipo: 'dissolvenza', alfa: [[0, 0], [0.7, 0], [3.4, 1]], sfoca: SFOCA_ORARIO },
      } },
      blocchi: function (d, ctx) {
        return [
          { nome: 'orario', left: 323.421, top: 1334.428, width: 1513.158, align: 'center', lh: 1.01, ls: 0,
            lines: [riga('belleza', 158.618, BIANCO, quando(d) + ' - h ' + d.orario)] },
          nomi(d, ctx, { left: 445.944, top: 954.161, width: 1268.111, align: 'center', lh: 1.4, ls: 0, ombra: OMBRA_NOMI, size: 78.6668 }),
        ]
      },
    },
    // Schermi esterni — programma: titolo «TONIGHT!» o «TOMORROW!» e orario, nomi in basso a sinistra
    'esterni-programma': {
      w: 2160, h: 3840, plate: 'plate/esterni-prog.jpg',
      video: { plate: 'plate/esterni-prog.mp4', w: 2160, h: 3840, bitrate: 8e6, tempo: TEMPO, anim: {
        'titolo:t1': { tipo: 'macchina', t0: 0.05, durata: 0.95, sfumo: 0.1 },
        'titolo:t2': { tipo: 'macchina', t0: 1.15, durata: 0.85, sfumo: 0.1 },
      } },
      blocchi: function (d, ctx) {
        var b = programma(d, ctx, { k: 1, ombra: OMBRA_PROG, larghezza: 2160,
          sx: { left: -31.341, top: 1192.849, width: 1182.828, maxY: 3350 }, dx: { left: 1080, top: 1192.849, width: 1070.438, maxY: 3790 } })
        return con([
          { nome: 'titolo', nocheck: true, left: -151.737, top: 706.57, width: 2463.473, align: 'center', lh: 1.05, ls: 0, ombra: OMBRA_TITOLO,
            lines: [conStrato(riga('belleza', 283.607, ORO, quando(d).toUpperCase() + '!'), 't1'), conStrato(riga('belleza', 134.311, ORO, d.orario, 0.5, 0.03), 't2')] },
          nomi(d, ctx, { left: 75.089, top: 3391.616, width: 1183.537, align: 'start', lh: 1.33, ls: 0.026, ombra: OMBRA_ARTISTI_B, size: 91.6827 }),
        ], b)
      },
    },
    // Tappo per il ledwall (4224x4320): stesso programma, tutto più grande
    'ledwall-programma': {
      w: 4224, h: 4320, plate: 'plate/ledwall-prog.jpg',
      blocchi: function (d, ctx) {
        var b = programma(d, ctx, { k: K_LEDWALL, ombra: OMBRA_LEDWALL, larghezza: 4224,
          sx: { left: -144.743, top: 1614.395, width: 2533.003, maxY: 4285 }, dx: { left: 2018.655, top: 1662.463, width: 2361.345, maxY: 4285 } })
        return con([
          nomi(d, ctx, { left: 974.508, top: 988.66, width: 2274.984, align: 'center', lh: 1.4, ls: 0, size: 141.1277 }),
        ], b)
      },
    },
    // Schermi interni, 16:9 (3845x2165): nomi degli artisti
    'wide-artisti': {
      w: 3845, h: 2165, plate: 'plate/wide-artisti.jpg',
      blocchi: function (d, ctx) {
        return [
          nomi(d, ctx, { left: 2603.65, top: 751.645, width: 1124.192, align: 'end', lh: 1.33, ls: 0.026, ombra: OMBRA_WIDE, size: 85.7277 }),
        ]
      },
    },
  }

  global.GRAFICHE_MODELLI = MODELLI
})(window)

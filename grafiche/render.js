// Disegna le grafiche delle serate di Voci d'Italia: sfondo esportato da Canva (senza i testi che cambiano) + testi
// riscritti con gli stessi font (Belleza, Radley, Allura: licenza OFL), le stesse misure e la stessa impaginazione
// del design Canva. Niente server: tutto nel browser, quindi funziona dal telefono e dal teatro.
(function (global) {
  // Metriche dei font (ascent/descent in frazione del corpo): servono a posizionare la linea di base come fa Canva.
  var FONT = {
    // Noto Serif (titoli dei brani, ruoli) e Roboto (opere, autori, nomi): gli stessi font dei template di Almagreal.
    // asc/desc sono le metriche del font; a = dove cade la linea di base in una riga con interlinea 1 (in frazione del corpo, misurato sui template di Canva).
    // Con interlinea maggiore di 1, circa un sesto dello spazio in più sta sopra il testo (EXTRA): base = alto + (a + EXTRA × (interlinea − 1)) × corpo.
    serifb: { css: 'Noto Serif', style: 'normal', weight: 700, asc: 1.069, desc: 0.293, a: 0.95 },
    serifi: { css: 'Noto Serif', style: 'italic', weight: 400, asc: 1.069, desc: 0.293, a: 0.95 },
    sansb: { css: 'Roboto', style: 'normal', weight: 700, asc: 0.928, desc: 0.244, a: 0.893 },
    sans: { css: 'Roboto', style: 'normal', weight: 400, asc: 0.928, desc: 0.244, a: 0.893 },
    sansi: { css: 'Roboto', style: 'italic', weight: 400, asc: 0.928, desc: 0.244, a: 0.893 },
    sansbi: { css: 'Roboto', style: 'italic', weight: 700, asc: 0.928, desc: 0.244, a: 0.893 },
  }

  var EXTRA = 0.15

  var haLetterSpacing = null
  function supportaLetterSpacing(ctx) {
    if (haLetterSpacing === null) haLetterSpacing = 'letterSpacing' in ctx
    return haLetterSpacing
  }

  function impostaFont(ctx, run, ls) {
    var f = FONT[run.f]
    ctx.font = f.style + ' ' + f.weight + ' ' + run.size + 'px "' + f.css + '"'
    if (global.GRAFICHE_KERN && 'fontKerning' in ctx) ctx.fontKerning = global.GRAFICHE_KERN
    if (supportaLetterSpacing(ctx)) ctx.letterSpacing = (ls || 0) * run.size + 'px'
  }

  // Larghezza di un testo con la spaziatura tra le lettere (in em) come nel design.
  function larghezza(ctx, run, testo, ls) {
    impostaFont(ctx, run, ls)
    var w = ctx.measureText(testo).width
    if (!supportaLetterSpacing(ctx) && ls) w += ls * run.size * testo.length
    return w
  }

  // Va a capo come Canva: parola per parola, quando la riga supera la larghezza del riquadro (e agli «a capo» scritti a mano).
  function righe(ctx, run, larg, ls) {
    var out = []
    String(run.t).split('\n').forEach(function (paragrafo) {
      var parole = paragrafo.split(' ')
      var corrente = ''
      parole.forEach(function (p) {
        var prova = corrente ? corrente + ' ' + p : p
        if (corrente && larghezza(ctx, run, prova, ls) > larg) {
          out.push(corrente)
          corrente = p
        } else corrente = prova
      })
      out.push(corrente)
    })
    return out
  }

  function disegnaTesto(ctx, run, testo, x, base, ls) {
    impostaFont(ctx, run, ls)
    ctx.fillStyle = global.GRAFICHE_SOLO ? '#ffffff' : run.color
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'left'
    if (supportaLetterSpacing(ctx) || !ls) {
      ctx.fillText(testo, x, base)
      return
    }
    // Browser senza letterSpacing nel canvas: lettera per lettera.
    var px = x
    for (var i = 0; i < testo.length; i++) {
      ctx.fillText(testo[i], px, base)
      px += ctx.measureText(testo[i]).width + ls * run.size
    }
  }

  // Un riquadro di testo: {left, top, width, align, ls, lh, lines:[{run:{t,f,size,color}, lh?, ls?, parts?:[run, run…]}]}
  // Come in Canva: ogni riga occupa «interlinea × corpo» e la sua linea di base sta a «(a + EXTRA × (interlinea − 1)) × corpo» dal bordo alto della riga.
  // Una riga può avere più parti con stili diversi sulla stessa linea di base (`parts`, es. «Soprano / » in grassetto e «Soprano» in corsivo):
  // non vanno a capo da sole. `impagina` calcola dove finisce ogni riga (serve sia per disegnare sia per controllare che tutto entri).
  function impagina(ctx, blk) {
    var cima = blk.top
    var out = []
    var xMin = Infinity
    var xMax = -Infinity
    blk.lines.forEach(function (ln) {
      var run = ln.run
      var lh = ln.lh != null ? ln.lh : blk.lh
      var ls = ln.ls != null ? ln.ls : blk.ls || 0
      if (ln.parts) {
        var gr = Math.max.apply(null, ln.parts.map(function (p) { return p.size }))
        var passoP = lh * gr
        var wTot = 0
        ln.parts.forEach(function (p) { wTot += larghezza(ctx, p, p.t, ls) })
        var fPrima = FONT[ln.parts[0].f]
        var baseP = cima + (fPrima.a + EXTRA * (lh - 1)) * gr
        cima += passoP
        var xP = blk.align === 'start' ? blk.left : blk.align === 'end' ? blk.left + blk.width - wTot : blk.left + (blk.width - wTot) / 2
        ln.parts.forEach(function (p) {
          var wp = larghezza(ctx, p, p.t, ls)
          var fp = FONT[p.f]
          xMin = Math.min(xMin, xP)
          xMax = Math.max(xMax, xP + wp)
          out.push({ run: p, testo: p.t, x: xP, base: baseP - (p.rialzo || 0) * gr, ls: ls, w: wp, discesa: fp.desc * p.size, strato: ln.strato || '' })
          xP += wp
        })
        return
      }
      var passo = lh * run.size
      var f = FONT[run.f]
      var pezzi = run.t ? righe(ctx, run, blk.width, ls) : ['']
      pezzi.forEach(function (testo) {
        var base = cima + (f.a + EXTRA * (lh - 1)) * run.size
        cima += passo
        if (!testo) return
        var w = larghezza(ctx, run, testo, ls)
        var x = blk.align === 'start' ? blk.left : blk.align === 'end' ? blk.left + blk.width - w : blk.left + (blk.width - w) / 2
        xMin = Math.min(xMin, x)
        xMax = Math.max(xMax, x + w)
        out.push({ run: run, testo: testo, x: x, base: base, ls: ls, w: w, discesa: f.desc * run.size, strato: ln.strato || '' })
      })
    })
    var ultimo = out.length ? out[out.length - 1] : null
    return { righe: out, fine: ultimo ? ultimo.base + ultimo.discesa : blk.top, xMin: xMin, xMax: xMax, alto: cima - blk.top }
  }

  function disegnaBlocco(ctx, blk) {
    var om = blk.ombra
    if (om && !global.GRAFICHE_SOLO) {
      ctx.shadowColor = 'rgba(0,0,0,' + om.a + ')'
      ctx.shadowOffsetX = om.dx
      ctx.shadowOffsetY = om.dy
      ctx.shadowBlur = om.blur
    }
    impagina(ctx, blk).righe.forEach(function (r) { disegnaTesto(ctx, r.run, r.testo, r.x, r.base, r.ls) })
    ctx.shadowColor = 'rgba(0,0,0,0)'
    ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0
  }

  var immagini = {}
  function caricaImmagine(src) {
    if (immagini[src]) return immagini[src]
    immagini[src] = new Promise(function (ok, ko) {
      var im = new Image()
      im.onload = function () { ok(im) }
      im.onerror = function () { delete immagini[src]; ko(new Error('Immagine non trovata: ' + src)) }
      im.src = src
    })
    return immagini[src]
  }

  var fontPronti = null
  function caricaFont() {
    if (fontPronti) return fontPronti
    var defs = [
      ['Noto Serif', 'normal', 'fonts/NotoSerif.woff2'],
      ['Noto Serif', 'italic', 'fonts/NotoSerif-Italic.woff2'],
      ['Roboto', 'normal', 'fonts/Roboto.woff2'],
      ['Roboto', 'italic', 'fonts/Roboto-Italic.woff2'],
    ]
    fontPronti = Promise.all(defs.map(function (d) {
      // Font variabili: un solo file per tutti i pesi (grassetto compreso).
      var ff = new FontFace(d[0], 'url(' + global.GRAFICHE_BASE + d[2] + ')', { style: d[1], weight: '100 900' })
      return ff.load().then(function (f) { document.fonts.add(f) })
    })).catch(function (e) { fontPronti = null; throw e })
    return fontPronti
  }

  // Ogni «strato» è una parte di testo animata a sé (un blocco, o una sua parte): lo si disegna su un canvas trasparente
  // grande come il video (k = video / modello), con la sua ombra, e si ricorda dov'è per sfumarlo o scriverlo a macchina.
  function strati(ctx, blocchi, W, H, k) {
    var gruppi = {}
    var ordine = []
    blocchi.forEach(function (b, i) {
      impagina(ctx, b).righe.forEach(function (r) {
        var nome = (b.nome || 'riquadro' + i) + (r.strato ? ':' + r.strato : '')
        if (!gruppi[nome]) { gruppi[nome] = { nome: nome, righe: [], ombra: b.ombra }; ordine.push(nome) }
        gruppi[nome].righe.push(r)
      })
    })
    return ordine.map(function (nome) {
      var g = gruppi[nome]
      var cv = document.createElement('canvas')
      cv.width = W
      cv.height = H
      var c = cv.getContext('2d')
      c.setTransform(k, 0, 0, k, 0, 0)
      var om = g.ombra
      if (om) { c.shadowColor = 'rgba(0,0,0,' + om.a + ')'; c.shadowOffsetX = om.dx * k; c.shadowOffsetY = om.dy * k; c.shadowBlur = om.blur * k }
      var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity
      g.righe.forEach(function (r) {
        disegnaTesto(c, r.run, r.testo, r.x, r.base, r.ls)
        xMin = Math.min(xMin, r.x); xMax = Math.max(xMax, r.x + r.w)
        yMin = Math.min(yMin, r.base - r.run.size); yMax = Math.max(yMax, r.base + r.discesa)
      })
      var m = 160 + (om ? Math.max(om.dx, om.dy) + om.blur : 0)
      var x0 = Math.max(0, Math.floor((xMin - m) * k)), y0 = Math.max(0, Math.floor((yMin - m) * k))
      var x1 = Math.min(W, Math.ceil((xMax + m) * k)), y1 = Math.min(H, Math.ceil((yMax + m) * k))
      return { nome: nome, canvas: cv, x0: x0, y0: y0, x1: x1, y1: y1, inkX0: xMin * k, inkX1: xMax * k }
    })
  }

  // Foto nei riquadri previsti dal template (es. le locandine orizzontali di Almagreal): la foto riempie il riquadro (ritagliata), si può
  // ingrandire (zoom ≥ 1) e spostare (cx, cy = punto della foto al centro del riquadro, da 0 a 1). Senza foto, un segnaposto grigio.
  function rettangoloFoto(slot, f) {
    var iw = f.img.naturalWidth || f.img.width
    var ih = f.img.naturalHeight || f.img.height
    var sc = Math.max(slot.w / iw, slot.h / ih) * Math.max(1, f.zoom || 1)
    var vw = slot.w / sc
    var vh = slot.h / sc
    var x0 = Math.min(Math.max((f.cx == null ? 0.5 : f.cx) * iw - vw / 2, 0), iw - vw)
    var y0 = Math.min(Math.max((f.cy == null ? 0.5 : f.cy) * ih - vh / 2, 0), ih - vh)
    return { x0: x0, y0: y0, vw: vw, vh: vh, sc: sc, iw: iw, ih: ih }
  }

  function disegnaFoto(ctx, slots, foto) {
    slots.forEach(function (slot, i) {
      var f = foto && foto[i]
      ctx.save()
      ctx.beginPath()
      ctx.rect(slot.x, slot.y, slot.w, slot.h)
      ctx.clip()
      if (f && f.img) {
        var r = rettangoloFoto(slot, f)
        ctx.drawImage(f.img, r.x0, r.y0, r.vw, r.vh, slot.x, slot.y, slot.w, slot.h)
      } else {
        ctx.fillStyle = '#c8d1d9'
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h)
        ctx.fillStyle = '#4b5563'
        ctx.font = '700 ' + Math.round(slot.w / 18) + 'px Roboto, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Scegli una foto', slot.x + slot.w / 2, slot.y + slot.h / 2)
      }
      ctx.restore()
    })
  }

  // Controllo finale: tutto il testo deve stare dentro la grafica (con un margine) e nei limiti di ogni riquadro.
  function controllo(ctx, modello, blocchi) {
    var problemi = []
    var margine = modello.w * 0.012
    blocchi.forEach(function (b, i) {
      var r = impagina(ctx, b)
      if (!r.righe.length || b.nocheck) return
      var nome = b.nome || ('riquadro ' + (i + 1))
      if (r.xMin < margine || r.xMax > modello.w - margine) problemi.push(nome + ': il testo esce dai bordi')
      if (r.fine > modello.h - margine) problemi.push(nome + ': il testo esce dal fondo')
      if (b.maxY && r.fine > b.maxY + 1) problemi.push(nome + ': non entra nello spazio disponibile')
    })
    var info = blocchi.info || {}
    return { problemi: problemi.filter(function (p, i, a) { return a.indexOf(p) === i }), scala: info.scala == null ? 1 : info.scala, minimo: info.minimo }
  }

  // Disegna un modello su un canvas. `modello` = {w, h, plate, blocchi(dati) -> [blocco]}
  function disegna(canvas, modello, dati, opzioni) {
    var scala = (opzioni && opzioni.scala) || 1
    canvas.width = Math.round(modello.w * scala)
    canvas.height = Math.round(modello.h * scala)
    return Promise.all([caricaFont(), caricaImmagine(global.GRAFICHE_BASE + modello.plate)]).then(function (r) {
      var ctx = canvas.getContext('2d')
      ctx.setTransform(scala, 0, 0, scala, 0, 0)
      if (global.GRAFICHE_SOLO) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, modello.w, modello.h) } else ctx.drawImage(r[1], 0, 0, modello.w, modello.h)
      if (modello.foto) disegnaFoto(ctx, modello.foto, dati && dati.foto)
      var blocchi = modello.blocchi(dati, ctx)
      blocchi.forEach(function (b) { disegnaBlocco(ctx, b) })
      canvas.grafiche = controllo(ctx, modello, blocchi)
      return canvas
    })
  }

  global.GRAFICHE_BASE = global.GRAFICHE_BASE || 'grafiche/'
  global.GRAFICHE_RENDER = { caricaFont: caricaFont, caricaImmagine: caricaImmagine, strati: strati, disegna: disegna, disegnaBlocco: disegnaBlocco, rettangoloFoto: rettangoloFoto, impagina: impagina, larghezza: larghezza, FONT: FONT }
})(window)

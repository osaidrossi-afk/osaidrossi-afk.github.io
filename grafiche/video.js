// Video delle grafiche (MP4): lo sfondo animato esportato da Canva (stessa animazione di sempre: logo, zoom, QR…) più i testi
// della serata che compaiono con le stesse animazioni misurate sui design di Osaid (dissolvenza con sfocatura, scrittura a macchina).
// Si fa tutto nel browser: fotogramma per fotogramma si compone, si codifica in H.264 (WebCodecs) e si impacchetta in MP4.
// Serve un browser recente per computer (Chrome o Edge); da telefono le PNG bastano.
(function (global) {
  var FPS = 30

  function interpola(punti, t) {
    if (!punti || !punti.length) return 1
    if (t <= punti[0][0]) return punti[0][1]
    for (var i = 1; i < punti.length; i++) {
      if (t <= punti[i][0]) {
        var a = punti[i - 1], b = punti[i]
        return a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0] || 1)
      }
    }
    return punti[punti.length - 1][1]
  }

  function supportato() {
    return typeof VideoEncoder === 'function' && typeof VideoFrame === 'function' && typeof global.Mp4Muxer === 'object'
  }

  function caricaVideo(src) {
    return new Promise(function (ok, ko) {
      var v = document.createElement('video')
      v.muted = true
      v.playsInline = true
      v.preload = 'auto'
      v.onloadeddata = function () { ok(v) }
      v.onerror = function () { ko(new Error('Video di sfondo non trovato')) }
      v.src = src
    })
  }

  function vaiA(v, t) {
    return new Promise(function (ok) {
      var fatto = function () { v.removeEventListener('seeked', fatto); ok() }
      v.addEventListener('seeked', fatto)
      v.currentTime = t
    })
  }

  // Scrittura a macchina: la parte già scritta è visibile, davanti c'è un bordo sfumato (come le lettere che si accendono).
  function sfumaMacchina(tmp, c, strato, anim, t, k) {
    var larg = strato.inkX1 - strato.inkX0
    var p = (t - anim.t0) / anim.durata
    var f = anim.sfumo / anim.durata
    function alfa(u) { return Math.max(0, Math.min(1, (p - u) / f)) }
    var g = c.createLinearGradient(strato.inkX0, 0, strato.inkX1, 0)
    var us = [0, p - f, p, 1].map(function (u) { return Math.max(0, Math.min(1, u)) }).sort(function (a, b) { return a - b })
    us.forEach(function (u) { g.addColorStop(u, 'rgba(0,0,0,' + alfa(u).toFixed(3) + ')') })
    c.globalCompositeOperation = 'destination-in'
    c.fillStyle = g
    c.fillRect(strato.x0, strato.y0, strato.x1 - strato.x0, strato.y1 - strato.y0)
    c.globalCompositeOperation = 'source-over'
  }

  // opzioni: {onProgresso(frazione), durata (s, di solito quella dello sfondo)}
  function creaVideo(modello, dati, opzioni) {
    opzioni = opzioni || {}
    var spec = modello.video
    if (!spec) return Promise.reject(new Error('Questa grafica non ha una versione video'))
    if (!supportato()) return Promise.reject(new Error('Questo browser non sa fare i video: usa Chrome o Edge dal computer'))
    var R = global.GRAFICHE_RENDER
    var W = spec.w, H = spec.h, k = W / modello.w

    return Promise.all([R.caricaFont(), caricaVideo(global.GRAFICHE_BASE + spec.plate)]).then(function (r) {
      var sfondo = r[1]
      // Durata totale (15 s): l'animazione di entrata dura quanto lo sfondo di Canva, poi l'ultima immagine resta ferma.
      var tempo = spec.tempo || { durata: sfondo.duration, fine: sfondo.duration - 0.03 }
      var durata = opzioni.durata || tempo.durata
      var frames = Math.round(durata * FPS)
      var ultimoDiverso = Math.ceil(tempo.fine * FPS)
      var fermo = false
      var cv = document.createElement('canvas')
      cv.width = W
      cv.height = H
      var ctx = cv.getContext('2d')
      var tmp = document.createElement('canvas')
      var tc = tmp.getContext('2d')

      // strati di testo
      var scratch = document.createElement('canvas').getContext('2d')
      var blocchi = modello.blocchi(dati, scratch)
      var info = blocchi.info
      var elenco = R.strati(scratch, blocchi, W, H, k)
      var animazioni = spec.anim || {}

      var codec = null
      var configs = ['avc1.640034', 'avc1.640033', 'avc1.64002A', 'avc1.4d0034', 'avc1.42003e']
      function scegliCodec(i) {
        if (i >= configs.length) return Promise.reject(new Error('Il browser non sa codificare il video H.264'))
        var cfg = { codec: configs[i], width: W, height: H, bitrate: spec.bitrate || 10e6, framerate: FPS, avc: { format: 'avc' } }
        return VideoEncoder.isConfigSupported(cfg).then(function (s) { return s.supported ? cfg : scegliCodec(i + 1) }).catch(function () { return scegliCodec(i + 1) })
      }

      return scegliCodec(0).then(function (cfg) {
        codec = cfg
        var target = new Mp4Muxer.ArrayBufferTarget()
        var muxer = new Mp4Muxer.Muxer({ target: target, video: { codec: 'avc', width: W, height: H }, fastStart: 'in-memory' })
        var errore = null
        var enc = new VideoEncoder({
          output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta) },
          error: function (e) { errore = e },
        })
        enc.configure(codec)

        function frame(i) {
          if (errore) return Promise.reject(errore)
          if (i >= frames) return Promise.resolve()
          var t = Math.min(i / FPS, tempo.fine)
          // Dopo l'entrata l'immagine non cambia più: si riusa l'ultimo fotogramma già composto.
          var comporre = i <= ultimoDiverso || !fermo
          return (comporre ? vaiA(sfondo, Math.min(t + 0.5 / FPS, sfondo.duration - 0.001)) : Promise.resolve()).then(function () {
            if (comporre) {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.globalAlpha = 1
            ctx.filter = 'none'
            ctx.drawImage(sfondo, 0, 0, W, H)
            elenco.forEach(function (s) {
              var an = animazioni[s.nome] || { tipo: 'statico' }
              var w = s.x1 - s.x0, h = s.y1 - s.y0
              if (an.tipo === 'statico') {
                if (t >= (an.da || 0)) ctx.drawImage(s.canvas, s.x0, s.y0, w, h, s.x0, s.y0, w, h)
              } else if (an.tipo === 'dissolvenza') {
                var a = interpola(an.alfa, t)
                if (a <= 0.003) return
                var sig = interpola(an.sfoca, t)
                ctx.save()
                ctx.globalAlpha = Math.min(1, a)
                ctx.filter = sig > 0.4 ? 'blur(' + sig.toFixed(2) + 'px)' : 'none'
                ctx.drawImage(s.canvas, s.x0, s.y0, w, h, s.x0, s.y0, w, h)
                ctx.restore()
              } else if (an.tipo === 'macchina') {
                if (t <= an.t0) return
                tmp.width = W
                tmp.height = H
                tc.drawImage(s.canvas, s.x0, s.y0, w, h, s.x0, s.y0, w, h)
                sfumaMacchina(tmp, tc, s, an, t, k)
                ctx.drawImage(tmp, s.x0, s.y0, w, h, s.x0, s.y0, w, h)
              }
            })
            }
            if (i >= ultimoDiverso) fermo = true
            var vf = new VideoFrame(cv, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) })
            enc.encode(vf, { keyFrame: i % (FPS * 2) === 0 })
            vf.close()
            if (opzioni.onProgresso) opzioni.onProgresso((i + 1) / frames)
            var attesa = enc.encodeQueueSize > 8 ? new Promise(function (ok) { setTimeout(ok, 30) }) : Promise.resolve()
            return attesa.then(function () { return frame(i + 1) })
          })
        }

        return frame(0).then(function () { return enc.flush() }).then(function () {
          muxer.finalize()
          var blob = new Blob([target.buffer], { type: 'video/mp4' })
          blob.grafiche = { scala: info ? info.scala : 1, frames: frames, codec: codec.codec, w: W, h: H }
          return blob
        })
      })
    })
  }

  global.GRAFICHE_VIDEO = { creaVideo: creaVideo, supportato: supportato }
})(window)

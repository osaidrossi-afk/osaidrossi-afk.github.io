// Video delle grafiche (MP4) per gli schermi esterni: lo sfondo dei template di Almagreal (fermo) e i testi della serata che entrano con
// un'animazione d'entrata lenta (dissolvenza, un po' di sfocatura che si schiarisce, una lieve salita); le note musicali dello sfondo
// entrano una per una; tutta la scena si assesta con un lento zoom indietro. Poi l'immagine resta ferma fino a 15 secondi.
// Si fa tutto nel browser: fotogramma per fotogramma si compone, si codifica in H.264 (WebCodecs) e si impacchetta in MP4.
// Serve un browser recente per computer (Chrome o Edge); da telefono le PNG bastano.
(function (global) {
  var FPS = 30

  // Valore di una curva a punti [[tempo, valore], ...] (interpolazione lineare; fuori dai punti resta il primo o l'ultimo valore).
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

  // opzioni: {onProgresso(frazione), durata (s)}
  // modello.video = {plate, w, h, bitrate, tempo:{durata, fine}, sfondoColore, camera:{scala}, fondo:{alfa}, livelli:[{src,x,y,w,h,anim:{alfa,scala,rot,dy}}],
  //                  anim: {strato: {tipo:'dissolvenza', alfa, sfoca, dy}} oppure una funzione (strati) che li calcola}
  function creaVideo(modello, dati, opzioni) {
    opzioni = opzioni || {}
    var spec = modello.video
    if (!spec) return Promise.reject(new Error('Questa grafica non ha una versione video'))
    if (!supportato()) return Promise.reject(new Error('Questo browser non sa fare i video: usa Chrome o Edge dal computer'))
    var R = global.GRAFICHE_RENDER
    var W = spec.w, H = spec.h, k = W / modello.w
    var base = global.GRAFICHE_BASE

    // Lo sfondo può essere un video animato di Canva oppure (template di Almagreal) un'immagine ferma: in tal caso si animano i livelli e i testi.
    var daImmagine = /\.(png|jpe?g|webp)$/i.test(spec.plate)
    var livelliSrc = (spec.livelli || []).map(function (l) { return R.caricaImmagine(base + l.src) })
    return Promise.all([R.caricaFont(), daImmagine ? R.caricaImmagine(base + spec.plate) : caricaVideo(base + spec.plate), Promise.all(livelliSrc)]).then(function (r) {
      var sfondo = r[1]
      var immaginiLivelli = r[2]
      var tempo = spec.tempo || { durata: sfondo.duration, fine: sfondo.duration - 0.03 }
      var durata = opzioni.durata || tempo.durata
      var frames = Math.round(durata * FPS)
      var ultimoDiverso = Math.ceil(tempo.fine * FPS)
      var fermo = false
      var cv = document.createElement('canvas')
      cv.width = W
      cv.height = H
      var ctx = cv.getContext('2d')

      // strati di testo
      var scratch = document.createElement('canvas').getContext('2d')
      var blocchi = modello.blocchi(dati, scratch)
      var info = blocchi.info
      var elenco = R.strati(scratch, blocchi, W, H, k)
      var animazioni = typeof spec.anim === 'function' ? spec.anim(elenco) : spec.anim || {}

      var codec = null
      var configs = ['avc1.640034', 'avc1.640033', 'avc1.64002A', 'avc1.4d0034', 'avc1.42003e']
      function scegliCodec(i) {
        if (i >= configs.length) return Promise.reject(new Error('Il browser non sa codificare il video H.264'))
        var cfg = { codec: configs[i], width: W, height: H, bitrate: spec.bitrate || 10e6, framerate: FPS, avc: { format: 'avc' } }
        return VideoEncoder.isConfigSupported(cfg).then(function (s) { return s.supported ? cfg : scegliCodec(i + 1) }).catch(function () { return scegliCodec(i + 1) })
      }

      // Un fotogramma: sfondo → livelli (note) → testi, tutto dentro la «macchina da presa» che si assesta lentamente.
      function componi(t) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.globalAlpha = 1
        ctx.filter = 'none'
        ctx.fillStyle = spec.sfondoColore || '#000'
        ctx.fillRect(0, 0, W, H)
        var s = spec.camera ? interpola(spec.camera.scala, t) : 1
        ctx.setTransform(s, 0, 0, s, (1 - s) * W / 2, (1 - s) * H / 2)
        var a0 = spec.fondo ? interpola(spec.fondo.alfa, t) : 1
        if (a0 > 0.002) {
          ctx.globalAlpha = Math.min(1, a0)
          ctx.drawImage(sfondo, 0, 0, W, H)
          ctx.globalAlpha = 1
        }
        ;(spec.livelli || []).forEach(function (l, i) {
          var an = l.anim || {}
          var a = an.alfa ? interpola(an.alfa, t) : 1
          if (a <= 0.003) return
          var sc = an.scala ? interpola(an.scala, t) : 1
          var rot = an.rot ? interpola(an.rot, t) : 0
          var dy = an.dy ? interpola(an.dy, t) : 0
          var cx = (l.x + l.w / 2) * k, cy = (l.y + l.h / 2) * k + dy * k
          ctx.save()
          ctx.globalAlpha = Math.min(1, a)
          ctx.translate(cx, cy)
          ctx.rotate((rot * Math.PI) / 180)
          ctx.scale(sc, sc)
          ctx.drawImage(immaginiLivelli[i], (-l.w / 2) * k, (-l.h / 2) * k, l.w * k, l.h * k)
          ctx.restore()
        })
        elenco.forEach(function (st) {
          var an = animazioni[st.nome] || { tipo: 'statico' }
          var w = st.x1 - st.x0, h = st.y1 - st.y0
          if (an.tipo === 'statico') {
            if (t >= (an.da || 0)) ctx.drawImage(st.canvas, st.x0, st.y0, w, h, st.x0, st.y0, w, h)
            return
          }
          var a = interpola(an.alfa, t)
          if (a <= 0.003) return
          var sig = an.sfoca ? interpola(an.sfoca, t) : 0
          var dy = an.dy ? interpola(an.dy, t) * k : 0
          ctx.save()
          ctx.globalAlpha = Math.min(1, a)
          ctx.filter = sig > 0.4 ? 'blur(' + sig.toFixed(2) + 'px)' : 'none'
          ctx.drawImage(st.canvas, st.x0, st.y0, w, h, st.x0, st.y0 + dy, w, h)
          ctx.restore()
        })
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      // Per provare l'animazione senza fare il video: restituisce alcuni fotogrammi (ridotti) agli istanti indicati.
      if (opzioni.soloFotogrammi && daImmagine) {
        return Promise.resolve(opzioni.soloFotogrammi.map(function (t) {
          componi(t)
          var c = document.createElement('canvas')
          c.width = Math.round(W / 4)
          c.height = Math.round(H / 4)
          c.getContext('2d').drawImage(cv, 0, 0, c.width, c.height)
          return c
        }))
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
          return (comporre && !daImmagine ? vaiA(sfondo, Math.min(t + 0.5 / FPS, sfondo.duration - 0.001)) : Promise.resolve()).then(function () {
            if (comporre) componi(t)
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

  global.GRAFICHE_VIDEO = { creaVideo: creaVideo, supportato: supportato, interpola: interpola }
})(window)

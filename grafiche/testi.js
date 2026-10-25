// Regole sui testi delle grafiche: i titoli e le opere restano esattamente come li scrive chi prepara il programma; i nomi degli autori
// si abbreviano sempre (iniziale + punto + cognome).
(function (global) {
  var PARTICELLE = ['de', 'di', 'da', 'del', 'della', 'dei', 'degli', 'van', 'von', 'der', 'den', 'du', 'le', 'la', 'mc', 'mac']

  function autore(s) {
    s = String(s || '').trim().replace(/^by\s+/i, '')
    if (!s) return ''
    s = s.replace(/\b([A-Za-zÀ-ÿ])\.(?=[A-Za-zÀ-ÿ])/g, '$1. ').replace(/\s+/g, ' ')
    var parole = s.split(' ')
    if (parole.length < 2) return s
    var i = parole.length - 1
    while (i > 1 && PARTICELLE.indexOf(parole[i - 1].toLowerCase()) >= 0) i--
    var nomi = parole.slice(0, i).map(function (w) { return w.charAt(0).toUpperCase() + '.' })
    return nomi.join(' ') + ' ' + parole.slice(i).join(' ')
  }

  // Titolo del brano: tra virgolette «“ ”»; se ci sono già (anche dentro il titolo) restano com'è.
  function titolo(t) {
    t = String(t || '').trim()
    if (!t) return ''
    t = t.replace(/(^|[\s–—-])"/g, '$1“').replace(/"/g, '”').replace(/«/g, '“').replace(/»/g, '”')
    if (/[“”]/.test(t)) return t
    return '“' + t + '”'
  }

  var RE_SOLO = /(interlude|intermezzo|piano\s*solo|solo\s*piano|pianoforte\s*solo)/i
  var RE_TITOLO_PAGINA = /^(concert\s*programm?e?!?|programm?a|programme|tonight.*)$/i

  // Legge il programma come arriva su WhatsApp e lo trasforma in elenco: brani, pezzi solo per pianoforte, intervallo.
  function leggiProgramma(testo) {
    var righe = String(testo || '').replace(/\r/g, '').split('\n').map(function (l) { return l.trim() })
    var voci = []
    var cur = null
    var solo = null
    righe.forEach(function (l) {
      if (!l) { cur = null; solo = null; return }
      if (RE_TITOLO_PAGINA.test(l)) return
      if (/interval\s*drink/i.test(l) || /^[-–—_=~*]{5,}$/.test(l)) { voci.push({ tipo: 'intervallo' }); cur = null; solo = null; return }
      if (/^[-–—_=~*]{1,4}$/.test(l)) return
      if (RE_SOLO.test(l) && !/^by\s/i.test(l)) {
        if (solo) solo.testo += '\n' + l
        else { solo = { tipo: 'solo', testo: l }; voci.push(solo) }
        cur = null
        return
      }
      solo = null
      if (!cur) { cur = { tipo: 'brano', titolo: l, opera: '', autore: '' }; voci.push(cur); return }
      if (/^by\s+/i.test(l)) cur.autore = autore(l)
      else if (!cur.opera) cur.opera = l
      else cur.opera += ' ' + l
    })
    return voci
  }

  global.GRAFICHE_TESTI = { autore: autore, titolo: titolo, leggiProgramma: leggiProgramma }
})(window)

import{F as e,N as t,_ as n,ct as r,g as i,lt as a,n as o,q as s,y as c}from"./ui-BZ0ERyRN.js";import{t as l}from"./copy-DWQ1-xi8.js";import{$ as u,$t as d,A as f,Pt as p,jt as m,mt as h,n as g,pt as _,v,x as y,yt as b}from"./store-Cu2D4S66.js";import{l as x}from"./rotta-VHT9YqM6.js";import{M as S,N as C,P as w,d as T,f as E,it as D,j as O,o as k,u as A}from"./index-DtJSSv61.js";var j={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};j.node;var M=r(j),N={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};N.node;var P=r(N),F={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};F.node;var I=r(F),L={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};L.node;var R=r(L),z=a(),B=`/**\r
 * Postino del CRM — Teatro Nazionale Firenze\r
 *\r
 * Vive nel Gmail teatronazionalefirenze@gmail.com (quello che importa info@ via POP3). Fa questi lavori, tutti senza\r
 * Claude (continua a funzionare anche quando i crediti finiscono):\r
 *\r
 * 1. Ogni 5 minuti manda al CRM i messaggi arrivati dall'ultimo controllo (con 4 ore di margine per i ritardi del POP).\r
 *    Il CRM tiene SOLO le risposte dei lead e i rimbalzi; tutto il resto lo ignora e non lo salva.\r
 *\r
 * 2. Ogni minuto controlla se nel CRM c'è una bozza «da mettere in Gmail» e la crea tra le BOZZE di Gmail, pronta da\r
 *    inviare anche dal telefono. NON la invia mai.\r
 *\r
 * 3. Ogni minuto (dalle 7 alle 23) guarda i messaggi che hai appena INVIATO dal Gmail del teatro: se sono diretti a un\r
 *    lead, il CRM lo segna «contattato» e fissa il follow-up, e l'app te lo conferma subito. Ogni 15 minuti ripassa tutto\r
 *    quello inviato dall'ultimo ripasso, per non perdere niente (anche quello che invii di notte).\r
 *\r
 * 4. Ogni mattina legge i report DMARC arrivati (allegati compressi che il CRM da solo non apre) e manda al CRM un\r
 *    riassunto: dice se le email spedite con l'indirizzo del dominio superano i controlli di sicurezza.\r
 *\r
 * 5. Ogni 15 minuti rilegge in Gmail, pochi lead alla volta, la conversazione con ciascuno (ultimi 6 mesi): i messaggi che\r
 *    il CRM non ha ancora (arrivati prima del Postino, archiviati, scritti da un collega con il teatro in copia) entrano\r
 *    nella scheda del lead e nella sua storia. Così «Prepara messaggio» parte sempre dalla conversazione vera.\r
 *\r
 * 6. Ogni 15 minuti legge le conversazioni che il team (Matteo) porta avanti con clienti e agenzie mettendo info@ in copia:\r
 *    il CRM ne tiene un riassunto (con chi, su cosa, chi deve rispondere) nella sezione «Trattative», e se il cliente è un\r
 *    lead le aggiunge alla sua storia. Così non serve chiedere a Matteo cosa ha risposto.\r
 *\r
 * 7. Ogni lunedì mattina scarica un esportino di tutti i dati del CRM (lead, contatti, storico) e lo salva su Google\r
 *    Drive, cartella «CRM Teatro — Backup». Tiene solo le ultime 10 settimane, le più vecchie le cancella da sole.\r
 *\r
 * 8. Ogni 15 minuti sposta rimbalzi, avvisi di mancata consegna e report DMARC già letti dal CRM fuori dalla posta in\r
 *    arrivo, sotto l'etichetta «Sistema (rimbalzi e DMARC)»: non confondono più chi legge la posta.\r
 *\r
 * Google limita le operazioni sulla posta di un Gmail personale (circa 20.000 al giorno): ogni giro legge solo il tempo\r
 * passato dall'ultimo e tutte le conversazioni in una volta sola. Vedi «quota giornaliera di Gmail» più sotto.\r
 *\r
 * 10. Manda anche alla funzione «richieste» la stessa posta in arrivo e gli invii: lì restano solo le richieste generiche di\r
 *     chi non è un lead (clienti, scuole, informazioni, proposte), che nell'app hanno la loro sezione con la risposta pronta.\r
 *     La prima volta recupera le ultime due settimane.\r
 *\r
 * 9. A ogni giro cancella da Gmail le bozze che il CRM ha tolto: quelle sostituite da una risposta riscritta da Claude e\r
 *    quelle tolte dall'app con «Non inviato, toglilo». Così in Gmail resta solo quella giusta e la vecchia non parte per sbaglio.\r
 *\r
 * Questo script NON invia email e NON cancella posta: legge, crea bozze, cancella solo le bozze che il CRM ha tolto e\r
 * archivia la sola posta di sistema. Su Drive scrive solo dentro la\r
 * sua cartella di backup, non tocca nient'altro.\r
 *\r
 * La chiave la crea lo script stesso al primo avvio (proprietà CHIAVE_POSTINO) e la registra una volta sul\r
 * CRM: nessuno deve copiarla o incollarla. Il CRM accetta la registrazione solo se è stata aperta a mano.\r
 *\r
 * Installazione / aggiornamento: incolla il codice ed esegui «installa» una volta (Google chiede l'autorizzazione:\r
 * accetta tutto, serve per leggere la posta e creare bozze).\r
 */\r
const INDIRIZZO_CRM = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/agente-ricerca';\r
const INDIRIZZO_NOTIFICA = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/notifica';\r
const INDIRIZZO_RICHIESTE = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/richieste';\r
const CARTELLA_BACKUP = 'CRM Teatro — Backup';\r
const SETTIMANE_DA_TENERE = 10;\r
// Le bozze partono dall'indirizzo del teatro (alias «Invia come» del Gmail, via SMTP Aruba), non dal Gmail: così il\r
// destinatario vede il dominio vero e le risposte arrivano in info@ (visibili anche in Outlook). Se l'alias non c'è,\r
// la bozza nasce dal Gmail come prima.\r
const MITTENTE = 'info@teatronazionalefirenze.it';\r
// Cambia a ogni modifica del Postino: l'app la confronta con la sua copia e, se questa è vecchia, chiede di rincollarlo.\r
const VERSIONE = '2026-10-20';\r
const NOME_MITTENTE = 'Osaid El Debuch – Teatro Nazionale Firenze';\r
\r
/** Da eseguire UNA volta (anche di nuovo, dopo un aggiornamento del codice): rimette a posto i controlli\r
 *  automatici e fa subito un primo giro. */\r
function installa() {\r
  const props = PropertiesService.getScriptProperties();\r
  if (!props.getProperty('CHIAVE_POSTINO')) {\r
    const chiave = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');\r
    const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {\r
      method: 'post',\r
      contentType: 'application/json',\r
      headers: { 'x-postino-chiave': chiave },\r
      payload: JSON.stringify({ azione: 'registra' }),\r
      muteHttpExceptions: true,\r
    });\r
    if (r.getResponseCode() !== 200) throw new Error('Registrazione rifiutata dal CRM (' + r.getResponseCode() + '): chiedi a Claude di riaprirla');\r
    props.setProperty('CHIAVE_POSTINO', chiave);\r
  }\r
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });\r
  ScriptApp.newTrigger('controllaPosta').timeBased().everyMinutes(5).create();\r
  ScriptApp.newTrigger('ogniMinuto').timeBased().everyMinutes(1).create();\r
  ScriptApp.newTrigger('controllaInviati').timeBased().everyMinutes(15).create();\r
  ScriptApp.newTrigger('controllaDmarc').timeBased().everyDays(1).atHour(7).create();\r
  ScriptApp.newTrigger('backupSettimanale').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(6).create();\r
  controllaPosta();\r
  elaboraBozze();\r
  controllaInviati();\r
  controllaDmarc();\r
}\r
\r
function chiaveOStop() {\r
  const chiave = PropertiesService.getScriptProperties().getProperty('CHIAVE_POSTINO');\r
  if (!chiave) throw new Error('Manca CHIAVE_POSTINO: esegui prima «installa»');\r
  return chiave;\r
}\r
\r
/** Chiama il CRM con la chiave del Postino e restituisce la risposta già letta come JSON. */\r
/** Le richieste generiche: se la funzione non risponde il resto del Postino va avanti lo stesso (si recupera al giro dopo). */\r
function chiamaRichieste(azione, resto) {\r
  try {\r
    const r = UrlFetchApp.fetch(INDIRIZZO_RICHIESTE, {\r
      method: 'post',\r
      contentType: 'application/json',\r
      headers: { 'x-postino-chiave': chiaveOStop() },\r
      payload: JSON.stringify(Object.assign({ azione: azione }, resto || {})),\r
      muteHttpExceptions: true,\r
    });\r
    return r.getResponseCode() === 200;\r
  } catch (e) {\r
    return false;\r
  }\r
}\r
\r
function chiamaCrm(azione, resto) {\r
  const corpo = Object.assign({ azione: azione }, resto || {});\r
  const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {\r
    method: 'post',\r
    contentType: 'application/json',\r
    headers: { 'x-postino-chiave': chiaveOStop() },\r
    payload: JSON.stringify(corpo),\r
    muteHttpExceptions: true,\r
  });\r
  if (r.getResponseCode() !== 200) throw new Error('CRM ha risposto ' + r.getResponseCode() + ' (' + azione + '): ' + r.getContentText().slice(0, 300));\r
  return JSON.parse(r.getContentText());\r
}\r
\r
// ---------- quota giornaliera di Gmail ----------\r
// Google concede a un Gmail personale un numero limitato di operazioni sulla posta al giorno (circa 20.000). Il 12/10/2026\r
// il Postino le ha finite alle 9:37: a ogni giro rileggeva una per una tutte le conversazioni degli ultimi giorni (in arrivo\r
// ogni 5 minuti, inviati ogni minuto e ogni 15), e da lì in poi né bozze né conferme fino al giorno dopo. Ora ogni ricerca\r
// guarda solo il tempo passato dall'ultimo giro riuscito (più un margine) e le conversazioni trovate si leggono tutte in una\r
// volta sola (GmailApp.getMessagesForThreads), non una per una. Se la quota finisce lo stesso, il Postino si ferma mezz'ora\r
// invece di ritentare ogni minuto, e le bozze rimaste a metà tornano in coda da sole (il CRM le riconsegna dopo 10 minuti).\r
\r
const PAUSA_QUOTA_MIN = 30;\r
\r
function quotaFinita(e) {\r
  return /too many times|troppe volte/i.test(String(e));\r
}\r
\r
function inPausa() {\r
  return Date.now() < Number(PropertiesService.getScriptProperties().getProperty('PAUSA_FINO') || 0);\r
}\r
\r
/** Esegue un lavoro del Postino, ma non durante la pausa per quota finita; se la quota finisce adesso, apre la pausa.\r
 *  Restituisce null se è andato bene, 'pausa' se non si è potuto fare, altrimenti l'errore. */\r
function giro(lavoro) {\r
  if (inPausa()) return 'pausa';\r
  try {\r
    lavoro();\r
    return null;\r
  } catch (e) {\r
    if (quotaFinita(e)) {\r
      PropertiesService.getScriptProperties().setProperty('PAUSA_FINO', String(Date.now() + PAUSA_QUOTA_MIN * 60000));\r
      return 'pausa';\r
    }\r
    return e;\r
  }\r
}\r
\r
// Operazioni Gmail fatte in questo giro: si contano per sapere quanto manca al limite (il CRM le somma per giorno).\r
let OPERAZIONI = 0;\r
function conta(n) {\r
  OPERAZIONI += n || 1;\r
}\r
\r
/** Fa i lavori di un controllo automatico e poi manda il segnale di vita, anche se qualcosa è andato storto: così l'app\r
 *  dice subito se il Postino è fermo (e perché), e se resta fermo più di 20 minuti arriva una notifica sul telefono. */\r
function esegui(nome, lavori) {\r
  OPERAZIONI = 0;\r
  let errore = null;\r
  let pausa = false;\r
  lavori.forEach(function (lavoro) {\r
    const r = giro(lavoro);\r
    if (r === 'pausa') pausa = true;\r
    else if (r && !errore) errore = r;\r
  });\r
  battito(nome, !errore && !pausa, errore);\r
  if (errore) throw errore;\r
}\r
\r
function battito(nome, ok, errore) {\r
  try {\r
    const r = UrlFetchApp.fetch(INDIRIZZO_NOTIFICA, {\r
      method: 'post',\r
      contentType: 'application/json',\r
      headers: { 'x-postino-chiave': chiaveOStop() },\r
      payload: JSON.stringify({\r
        azione: 'battito',\r
        lavoro: nome,\r
        ok: ok,\r
        errore: errore ? String(errore).slice(0, 300) : null,\r
        pausa_fino: Number(PropertiesService.getScriptProperties().getProperty('PAUSA_FINO') || 0),\r
        operazioni: OPERAZIONI,\r
        versione: VERSIONE,\r
      }),\r
      muteHttpExceptions: true,\r
    });\r
    // In risposta, le bozze di Gmail che il CRM ha tolto: si cancellano e si conferma.\r
    if (r.getResponseCode() !== 200) return;\r
    const daTogliere = JSON.parse(r.getContentText()).da_togliere || [];\r
    const tolte = togliBozze(daTogliere);\r
    if (!tolte.length) return;\r
    UrlFetchApp.fetch(INDIRIZZO_NOTIFICA, {\r
      method: 'post',\r
      contentType: 'application/json',\r
      headers: { 'x-postino-chiave': chiaveOStop() },\r
      payload: JSON.stringify({ azione: 'bozze_tolte', tolte: tolte }),\r
      muteHttpExceptions: true,\r
    });\r
  } catch (e) { /* il segnale di vita non deve mai fermare il Postino */ }\r
}\r
\r
/** Cancella da Gmail le bozze tolte dal CRM. Se una non c'è più (già inviata o cancellata a mano) va bene lo stesso. */\r
function togliBozze(elenco) {\r
  const tolte = [];\r
  elenco.forEach(function (t) {\r
    let esito = 'tolta';\r
    try { conta(2); GmailApp.getDraft(t.draft_id).deleteDraft(); } catch (e) {\r
      if (quotaFinita(e)) return;\r
      esito = 'non trovata (già inviata o cancellata)';\r
    }\r
    tolte.push({ id: t.id, esito: esito });\r
  });\r
  return tolte;\r
}\r
\r
/** Ricerca in Gmail (conta come una operazione). */\r
function cerca(ricerca, da, quanti) {\r
  conta(1);\r
  return GmailApp.search(ricerca, da, quanti);\r
}\r
\r
/** Da quando cercare: dall'ultimo giro riuscito meno un margine, mai più indietro di \`massimoGiorni\`. */\r
function finestra(chiave, margineMinuti, massimoGiorni) {\r
  const ultimo = Number(PropertiesService.getScriptProperties().getProperty(chiave) || 0);\r
  const minimo = Date.now() - massimoGiorni * 86400000;\r
  return Math.max(minimo, (ultimo || minimo) - margineMinuti * 60000);\r
}\r
\r
/** Pezzo di ricerca Gmail «dopo questo momento» (Gmail vuole i secondi). */\r
function dopo(ms) {\r
  return ' after:' + Math.floor(ms / 1000);\r
}\r
\r
/** Tutti i messaggi delle conversazioni trovate, letti in una volta sola (una operazione invece di una per conversazione). */\r
function messaggiDi(fili) {\r
  if (!fili.length) return [];\r
  conta(1);\r
  return GmailApp.getMessagesForThreads(fili);\r
}\r
\r
/** Gli indirizzi «Invia come» del Gmail: cambiano di rado, si chiedono a Google al massimo ogni 6 ore. */\r
function alias() {\r
  const cache = CacheService.getScriptCache();\r
  const salvati = cache.get('ALIAS');\r
  if (salvati !== null) return JSON.parse(salvati);\r
  conta(1);\r
  const elenco = GmailApp.getAliases().map(function (x) { return x.toLowerCase(); });\r
  cache.put('ALIAS', JSON.stringify(elenco), 21600);\r
  return elenco;\r
}\r
\r
// ---------- posta in arrivo ----------\r
\r
function controllaPosta() {\r
  esegui('posta', [function () {\r
    const props = PropertiesService.getScriptProperties();\r
    chiaveOStop();\r
    const inizio = Date.now();\r
\r
    // Ultimi messaggi già mandati: così ogni messaggio parte una volta sola.\r
    const visti = JSON.parse(props.getProperty('VISTI') || '[]');\r
    const giaVisti = new Set(visti);\r
    const nuovi = [];\r
    // Margine di 4 ore: la posta di info@ arriva qui via POP, a volte con ore di ritardo. Al primo giro (o dopo un fermo)\r
    // si guardano gli ultimi 2 giorni, come prima.\r
    const fili = cerca('in:inbox' + dopo(finestra('POSTA_DAL', 240, 2)), 0, 100);\r
    const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase(), MITTENTE].filter(function (x) { return x; });\r
    messaggiDi(fili).forEach(function (messaggi) {\r
      // Con chi abbiamo scritto in questa conversazione: se rispondono da un altro indirizzo (un collega, la segreteria,\r
      // un Gmail personale) il server riconosce comunque il lead.\r
      const filo = [];\r
      messaggi.forEach(function (m) {\r
        const da = m.getFrom().toLowerCase();\r
        if (!miei.some(function (x) { return da.indexOf(x) !== -1; })) return;\r
        indirizziIn(m.getTo() + ',' + m.getCc()).forEach(function (e) {\r
          if (miei.indexOf(e) === -1 && filo.indexOf(e) === -1 && filo.length < 10) filo.push(e);\r
        });\r
      });\r
      messaggi.forEach(function (m) {\r
        const id = m.getId();\r
        if (giaVisti.has(id) || m.isDraft()) return;\r
        nuovi.push({\r
          id: id,\r
          da: m.getFrom(),\r
          a: indirizziIn(m.getTo()),\r
          cc: indirizziIn(m.getCc()),\r
          filo: filo,\r
          oggetto: m.getSubject(),\r
          data: m.getDate().toISOString(),\r
          anteprima: m.getPlainBody().slice(0, 6000),\r
        });\r
      });\r
    });\r
\r
    for (let i = 0; i < nuovi.length; i += 50) {\r
      const lotto = nuovi.slice(i, i + 50);\r
      chiamaCrm('posta', { messaggi: lotto });\r
      chiamaRichieste('posta', { messaggi: lotto });\r
      lotto.forEach(function (m) { visti.push(m.id); });\r
    }\r
    props.setProperty('VISTI', JSON.stringify(visti.slice(-400)));\r
    props.setProperty('POSTA_DAL', String(inizio));\r
    recuperaRichieste();\r
  }]);\r
}\r
\r
/** Una volta sola: le richieste generiche delle ultime due settimane, e i nostri invii, così le già risposte non restano aperte. */\r
function recuperaRichieste() {\r
  const props = PropertiesService.getScriptProperties();\r
  if (props.getProperty('RICHIESTE_RECUPERATE')) return;\r
  const arrivati = [];\r
  messaggiDi(cerca('in:inbox newer_than:14d', 0, 100)).forEach(function (messaggi) {\r
    messaggi.forEach(function (m) {\r
      if (m.isDraft()) return;\r
      arrivati.push({\r
        id: m.getId(), da: m.getFrom(), a: indirizziIn(m.getTo()), cc: indirizziIn(m.getCc()), filo: [],\r
        oggetto: m.getSubject(), data: m.getDate().toISOString(), anteprima: m.getPlainBody().slice(0, 6000),\r
      });\r
    });\r
  });\r
  const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase()].concat(alias()).filter(function (x) { return x; });\r
  const spediti = [];\r
  messaggiDi(cerca('in:sent newer_than:14d', 0, 100)).forEach(function (messaggi) {\r
    messaggi.forEach(function (m) {\r
      const da = m.getFrom().toLowerCase();\r
      if (m.isDraft() || (miei.length && !miei.some(function (x) { return da.indexOf(x) !== -1; }))) return;\r
      spediti.push({ id: m.getId(), a: indirizziIn(m.getTo() + ',' + m.getCc()), oggetto: m.getSubject(), data: m.getDate().toISOString() });\r
    });\r
  });\r
  let ok = true;\r
  for (let i = 0; i < arrivati.length; i += 50) ok = chiamaRichieste('posta', { messaggi: arrivati.slice(i, i + 50) }) && ok;\r
  for (let i = 0; i < spediti.length; i += 50) ok = chiamaRichieste('inviati', { messaggi: spediti.slice(i, i + 50) }) && ok;\r
  if (ok) props.setProperty('RICHIESTE_RECUPERATE', String(Date.now()));\r
}\r
\r
// ---------- bozze Gmail ----------\r
\r
/** Ogni minuto, di giorno: crea le bozze in coda e controlla gli invii appena fatti (conferma quasi immediata\r
 *  nell'app). Di notte si ferma per non consumare la quota giornaliera di Google; il ripasso ogni 15 minuti resta. */\r
function ogniMinuto() {\r
  const ora = Number(Utilities.formatDate(new Date(), 'Europe/Rome', 'H'));\r
  if (ora < 7 || ora >= 23) return;\r
  const lock = LockService.getScriptLock();\r
  if (!lock.tryLock(5000)) return; // un altro giro è ancora in corso\r
  try {\r
    esegui('minuto', [creaBozzeInCoda, function () {\r
      // Dall'ultimo controllo veloce riuscito, con 10 minuti di margine (al massimo l'ultima ora).\r
      const inizio = Date.now();\r
      inviatiDa('in:sent' + dopo(finestra('INVIATI_VELOCE_DAL', 10, 1 / 24)));\r
      PropertiesService.getScriptProperties().setProperty('INVIATI_VELOCE_DAL', String(inizio));\r
    }]);\r
  } finally {\r
    lock.releaseLock();\r
  }\r
}\r
\r
/** Le bozze «in coda» nel CRM diventano vere bozze di Gmail. Mai inviate. (Si può anche eseguire a mano.) */\r
function elaboraBozze() {\r
  const lock = LockService.getScriptLock();\r
  if (!lock.tryLock(5000)) return;\r
  try {\r
    esegui('bozze', [creaBozzeInCoda]);\r
  } finally {\r
    lock.releaseLock();\r
  }\r
}\r
\r
/** Vero se nel Gmail è attivo «Invia come» info@teatronazionalefirenze.it. */\r
function aliasTeatro() {\r
  return alias().indexOf(MITTENTE) !== -1;\r
}\r
\r
function creaBozzeInCoda() {\r
  const coda = (chiamaCrm('bozze_in_coda').bozze) || [];\r
  if (!coda.length) return;\r
  const fatte = [];\r
  const errori = [];\r
  const daTeatro = aliasTeatro();\r
  let finita = null;\r
  coda.forEach(function (b) {\r
    // Quota finita: le bozze rimaste non si segnano come errore, restano «in creazione» e il CRM le rimette in coda.\r
    if (finita) return;\r
    try {\r
      const opzioni = b.html ? { htmlBody: b.html } : {};\r
      if (daTeatro) { opzioni.from = MITTENTE; opzioni.name = NOME_MITTENTE; }\r
      let bozza = null;\r
      // Risposta a un messaggio ricevuto: la bozza nasce dentro la stessa conversazione.\r
      if (b.rispondi_a) {\r
        try { conta(2); bozza = GmailApp.getMessageById(b.rispondi_a).createDraftReply(b.testo || '', opzioni); } catch (er) {\r
          if (quotaFinita(er)) throw er;\r
          bozza = null;\r
        }\r
      }\r
      if (!bozza) { conta(1); bozza = GmailApp.createDraft(b.a, b.oggetto || '', b.testo || '', opzioni); }\r
      fatte.push({ id: b.id, draft_id: bozza.getId() });\r
    } catch (e) {\r
      if (quotaFinita(e)) finita = e;\r
      else errori.push({ id: b.id, errore: String(e).slice(0, 280) });\r
    }\r
  });\r
  if (fatte.length || errori.length) chiamaCrm('bozze_fatte', { fatte: fatte, errori: errori });\r
  if (finita) throw finita;\r
}\r
\r
// ---------- messaggi inviati ----------\r
\r
function indirizziIn(testo) {\r
  return (String(testo || '').match(/[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+/g) || []).map(function (e) { return e.toLowerCase(); });\r
}\r
\r
/** Ogni 15 minuti: ripasso degli invii (anche quelli fatti di notte, quando il controllo veloce dorme), poi le\r
 *  conversazioni dei lead, quelle del team e la posta di sistema. */\r
function controllaInviati() {\r
  esegui('ripasso', [ripassoInviati, rileggiConversazioni, rileggiTeam, riordinaSistema]);\r
}\r
\r
function ripassoInviati() {\r
  const lock = LockService.getScriptLock();\r
  if (!lock.tryLock(20000)) return;\r
  try {\r
    // Dall'ultimo ripasso riuscito con un'ora di margine; al primo giro (o dopo un fermo) gli ultimi 3 giorni.\r
    const inizio = Date.now();\r
    inviatiDa('in:sent' + dopo(finestra('INVIATI_DAL', 60, 3)));\r
    PropertiesService.getScriptProperties().setProperty('INVIATI_DAL', String(inizio));\r
  } finally {\r
    lock.releaseLock();\r
  }\r
}\r
\r
/** Le trattative del team: conversazioni in cui scrive Matteo (o in cui gli scrivono), con info@ in copia. La prima volta\r
 *  legge gli ultimi due mesi, 40 conversazioni per giro; poi solo quelle degli ultimi giorni che hanno messaggi nuovi. */\r
function rileggiTeam() {\r
  const props = PropertiesService.getScriptProperties();\r
  const cosa = chiamaCrm('team_da_leggere');\r
  if (!cosa.ricerca) return;\r
  const PASSO = 40;\r
  const da = Number(props.getProperty('TEAM_DA') || 0);\r
  const visti = JSON.parse(props.getProperty('TEAM_VISTI') || '{}');\r
  const fili = cerca(cosa.ricerca, da, PASSO);\r
  const pacchi = [];\r
  messaggiDi(fili).forEach(function (tutti, i) {\r
    const veri = tutti.filter(function (m) { return !m.isDraft(); });\r
    if (!veri.length) return;\r
    const ultimo = veri[veri.length - 1].getDate().getTime();\r
    const id = fili[i].getId();\r
    if (visti[id] === ultimo) return; // niente di nuovo in questa conversazione\r
    const messaggi = veri.slice(-30).map(function (m) {\r
      return {\r
        id: m.getId(),\r
        da: m.getFrom(),\r
        a: indirizziIn(m.getTo()),\r
        cc: indirizziIn(m.getCc()),\r
        oggetto: m.getSubject(),\r
        data: m.getDate().toISOString(),\r
        corpo: m.getPlainBody().slice(0, 2500),\r
      };\r
    });\r
    pacchi.push({ id: id, totale: tutti.length, messaggi: messaggi, ultimo: ultimo });\r
  });\r
  const finito = fili.length < PASSO || da + PASSO >= (cosa.massimo || 300);\r
  for (let i = 0; i < pacchi.length; i += 20) {\r
    const lotto = pacchi.slice(i, i + 20);\r
    chiamaCrm('team', { fili: lotto, fine: finito && i + 20 >= pacchi.length });\r
    lotto.forEach(function (f) { visti[f.id] = f.ultimo; });\r
  }\r
  if (!pacchi.length && finito) chiamaCrm('team', { fili: [], fine: true });\r
  props.setProperty('TEAM_DA', finito ? '0' : String(da + PASSO));\r
  // Si ricordano solo le 150 conversazioni più recenti (una proprietà tiene al massimo 9 KB).\r
  const tenuti = Object.keys(visti).sort(function (x, y) { return visti[y] - visti[x]; }).slice(0, 150);\r
  const piccolo = {};\r
  tenuti.forEach(function (k) { piccolo[k] = visti[k]; });\r
  props.setProperty('TEAM_VISTI', JSON.stringify(piccolo));\r
}\r
\r
/** Rete di sicurezza: il CRM indica quali lead rileggere (al massimo 15 per volta; quelli in conversazione ogni giorno,\r
 *  gli altri ogni settimana) e la ricerca da fare; qui si raccolgono i messaggi e il CRM tiene solo quello che manca.\r
 *  Si può anche eseguire a mano. */\r
function rileggiConversazioni() {\r
  const daLeggere = (chiamaCrm('conversazioni_da_leggere').leads) || [];\r
  if (!daLeggere.length) return;\r
  // Una ricerca per lead, poi tutte le conversazioni trovate lette in una volta sola.\r
  const filiPerLead = daLeggere.map(function (l) { return cerca(l.ricerca, 0, 15); });\r
  const tutti = messaggiDi([].concat.apply([], filiPerLead));\r
  let k = 0;\r
  const letture = daLeggere.map(function (l, i) {\r
    const messaggi = [];\r
    filiPerLead[i].forEach(function () {\r
      tutti[k++].forEach(function (m) {\r
        if (m.isDraft() || messaggi.length >= 80) return;\r
        messaggi.push({\r
          id: m.getId(),\r
          da: m.getFrom(),\r
          a: indirizziIn(m.getTo() + ',' + m.getCc()),\r
          oggetto: m.getSubject(),\r
          data: m.getDate().toISOString(),\r
          corpo: m.getPlainBody().slice(0, 3000),\r
        });\r
      });\r
    });\r
    return { lead_id: l.id, messaggi: messaggi };\r
  });\r
  chiamaCrm('conversazioni', { letture: letture });\r
}\r
\r
/** I messaggi inviati dal Gmail del teatro verso i lead diventano «contatto fatto» nel CRM. */\r
function inviatiDa(ricerca) {\r
  const props = PropertiesService.getScriptProperties();\r
  chiaveOStop();\r
  // Anche i messaggi spediti da Gmail «come» info@ (alias) sono nostri.\r
  const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase()].concat(alias()).filter(function (x) { return x; });\r
  const limite = new Date(Date.now() - 3 * 86400000);\r
  const visti = JSON.parse(props.getProperty('VISTI_INVIATI') || '[]');\r
  const giaVisti = new Set(visti);\r
  const nuovi = [];\r
  messaggiDi(cerca(ricerca, 0, 100)).forEach(function (messaggi) {\r
    messaggi.forEach(function (m) {\r
      const id = m.getId();\r
      if (giaVisti.has(id) || m.isDraft() || m.getDate() < limite) return;\r
      const da = m.getFrom().toLowerCase();\r
      if (miei.length && !miei.some(function (x) { return da.indexOf(x) !== -1; })) return; // solo i messaggi spediti da noi\r
      nuovi.push({\r
        id: id,\r
        a: indirizziIn(m.getTo() + ',' + m.getCc()),\r
        oggetto: m.getSubject(),\r
        data: m.getDate().toISOString(),\r
        corpo: m.getPlainBody().slice(0, 4000),\r
      });\r
    });\r
  });\r
  if (!nuovi.length) return;\r
  for (let i = 0; i < nuovi.length; i += 50) {\r
    const lotto = nuovi.slice(i, i + 50);\r
    chiamaCrm('inviati', { messaggi: lotto });\r
    chiamaRichieste('inviati', { messaggi: lotto });\r
    lotto.forEach(function (m) { visti.push(m.id); });\r
  }\r
  // Una proprietà di Apps Script tiene al massimo 9 KB: 400 id bastano per tre giorni di invii.\r
  props.setProperty('VISTI_INVIATI', JSON.stringify(visti.slice(-400)));\r
}\r
\r
// ---------- posta di sistema fuori dalla posta in arrivo ----------\r
\r
const ETICHETTA_SISTEMA = 'Sistema (rimbalzi e DMARC)';\r
// Avvisi di mancata consegna, ritardi e report DMARC: servono al CRM, non a chi legge la posta.\r
const RICERCA_SISTEMA = 'in:inbox {from:mailer-daemon from:postmaster from:noreply-dmarc-support@google.com from:dmarcreport from:dmarc subject:"Report domain" subject:"Delivery Status Notification" subject:"Undeliverable" subject:"Mail delivery failed" subject:"Non recapitabile" subject:"Returned mail"}';\r
\r
/** Sposta la posta di sistema fuori dalla posta in arrivo, sotto l'etichetta «Sistema (rimbalzi e DMARC)». Solo quella\r
 *  che il CRM ha già letto (oppure più vecchia di due giorni): così nessun rimbalzo o report va perso. Non cancella niente. */\r
function riordinaSistema() {\r
  const props = PropertiesService.getScriptProperties();\r
  const letti = new Set(JSON.parse(props.getProperty('VISTI') || '[]').concat(JSON.parse(props.getProperty('DMARC_VISTI') || '[]')));\r
  const vecchio = Date.now() - 2 * 86400000;\r
  const fili = cerca(RICERCA_SISTEMA, 0, 100);\r
  if (!fili.length) return;\r
  const daSpostare = [];\r
  messaggiDi(fili).forEach(function (messaggi, i) {\r
    // Una conversazione con un nostro invio e il suo rimbalzo: si sposta solo se tutti i messaggi in arrivo sono di sistema.\r
    const altri = messaggi.some(function (m) {\r
      const da = m.getFrom().toLowerCase();\r
      return !m.isDraft() && !/mailer-daemon|postmaster|dmarc|mimecastreport/.test(da) && !/teatronazionalefirenze/.test(da) && !/report domain/i.test(m.getSubject());\r
    });\r
    if (altri) return;\r
    const pronti = messaggi.every(function (m) {\r
      return letti.has(m.getId()) || m.getDate().getTime() < vecchio || /teatronazionalefirenze/.test(m.getFrom().toLowerCase());\r
    });\r
    if (pronti) daSpostare.push(fili[i]);\r
  });\r
  if (!daSpostare.length) return;\r
  conta(3);\r
  const etichetta = GmailApp.getUserLabelByName(ETICHETTA_SISTEMA) || GmailApp.createLabel(ETICHETTA_SISTEMA);\r
  etichetta.addToThreads(daSpostare);\r
  GmailApp.moveThreadsToArchive(daSpostare);\r
}\r
\r
// ---------- report DMARC ----------\r
\r
/** Un report DMARC (XML) diventa un riassunto compatto: chi ha spedito a nome del dominio e se SPF/DKIM hanno passato. */\r
function leggiDmarc(xml) {\r
  const radice = XmlService.parse(xml).getRootElement();\r
  const ns = radice.getNamespace();\r
  const figlio = function (el, nome) { return el ? el.getChild(nome, ns) : null; };\r
  const testoDi = function (el, nome) { const f = figlio(el, nome); return f ? f.getText() : ''; };\r
  const meta = figlio(radice, 'report_metadata');\r
  const intervallo = figlio(meta, 'date_range');\r
  const politica = figlio(radice, 'policy_published');\r
  const aggregato = {};\r
  radice.getChildren('record', ns).forEach(function (rec) {\r
    const riga = figlio(rec, 'row');\r
    const ev = figlio(riga, 'policy_evaluated');\r
    const ident = figlio(rec, 'identifiers');\r
    const chiave = [testoDi(riga, 'source_ip'), testoDi(ev, 'disposition'), testoDi(ev, 'dkim'), testoDi(ev, 'spf'), testoDi(ident, 'header_from')].join('|');\r
    aggregato[chiave] = aggregato[chiave] || {\r
      ip: testoDi(riga, 'source_ip'), n: 0, disposizione: testoDi(ev, 'disposition'),\r
      dkim: testoDi(ev, 'dkim'), spf: testoDi(ev, 'spf'), da: testoDi(ident, 'header_from'),\r
    };\r
    aggregato[chiave].n += Number(testoDi(riga, 'count')) || 0;\r
  });\r
  const giorno = function (s) { return s ? Utilities.formatDate(new Date(Number(s) * 1000), 'Europe/Rome', 'yyyy-MM-dd') : null; };\r
  return {\r
    org: testoDi(meta, 'org_name'),\r
    da: giorno(testoDi(intervallo, 'begin')),\r
    a: giorno(testoDi(intervallo, 'end')),\r
    politica: testoDi(politica, 'p'),\r
    righe: Object.keys(aggregato).map(function (k) { return aggregato[k]; }),\r
  };\r
}\r
\r
/** Ogni mattina: legge i report DMARC arrivati negli ultimi giorni e ne manda il riassunto al CRM. */\r
/** Ogni mattina: legge i report DMARC arrivati negli ultimi giorni e ne manda il riassunto al CRM. */\r
function controllaDmarc() {\r
  esegui('dmarc', [function () {\r
    const props = PropertiesService.getScriptProperties();\r
    chiaveOStop();\r
    const visti = JSON.parse(props.getProperty('DMARC_VISTI') || '[]');\r
    const giaVisti = new Set(visti);\r
    const rapporti = [];\r
    const nuoviId = [];\r
    messaggiDi(cerca('subject:"Report Domain" OR subject:"Report domain" has:attachment newer_than:14d', 0, 40)).forEach(function (messaggi) {\r
      messaggi.forEach(function (m) {\r
        const id = m.getId();\r
        if (giaVisti.has(id)) return;\r
        nuoviId.push(id);\r
        m.getAttachments().forEach(function (a) {\r
          try {\r
            const nome = a.getName().toLowerCase();\r
            let xml = null;\r
            if (nome.indexOf('.gz') !== -1) xml = Utilities.ungzip(a.copyBlob().setContentType('application/x-gzip')).getDataAsString();\r
            else if (nome.indexOf('.zip') !== -1) xml = Utilities.unzip(a.copyBlob().setContentType('application/zip'))[0].getDataAsString();\r
            else if (nome.indexOf('.xml') !== -1) xml = a.getDataAsString();\r
            if (!xml) return;\r
            const r = leggiDmarc(xml);\r
            r.id = id + ':' + a.getName();\r
            rapporti.push(r);\r
          } catch (e) { /* un allegato illeggibile non blocca gli altri */ }\r
        });\r
      });\r
    });\r
    if (rapporti.length) chiamaCrm('dmarc', { rapporti: rapporti });\r
    nuoviId.forEach(function (id) { visti.push(id); });\r
    props.setProperty('DMARC_VISTI', JSON.stringify(visti.slice(-300)));\r
  }]);\r
}\r
\r
// ---------- backup ----------\r
\r
/** Un esportino dei dati del CRM su Drive, una volta a settimana. Non è un secondo posto dove *lavorare* i\r
 *  dati: serve solo come rete di sicurezza se succede qualcosa al database. */\r
function backupSettimanale() {\r
  const chiave = chiaveOStop();\r
  const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {\r
    method: 'post',\r
    contentType: 'application/json',\r
    headers: { 'x-postino-chiave': chiave },\r
    payload: JSON.stringify({ azione: 'backup' }),\r
    muteHttpExceptions: true,\r
  });\r
  if (r.getResponseCode() !== 200) throw new Error('CRM ha risposto ' + r.getResponseCode() + ': ' + r.getContentText());\r
\r
  const cartelle = DriveApp.getFoldersByName(CARTELLA_BACKUP);\r
  const cartella = cartelle.hasNext() ? cartelle.next() : DriveApp.createFolder(CARTELLA_BACKUP);\r
\r
  const oggi = Utilities.formatDate(new Date(), 'Europe/Rome', 'yyyy-MM-dd');\r
  cartella.createFile(Utilities.newBlob(r.getContentText(), 'application/json', 'backup-crm-' + oggi + '.json'));\r
\r
  // Pulizia: tiene solo le backup delle ultime SETTIMANE_DA_TENERE settimane.\r
  const limite = new Date();\r
  limite.setDate(limite.getDate() - SETTIMANE_DA_TENERE * 7);\r
  const file = cartella.getFiles();\r
  while (file.hasNext()) {\r
    const f = file.next();\r
    if (f.getName().indexOf('backup-crm-') === 0 && f.getDateCreated() < limite) f.setTrashed(true);\r
  }\r
}\r
`,V=100;async function H(e,t,n){for(let r=0;r<e.length;r+=V)await t(e.slice(r,r+V)),n(Math.min(r+V,e.length))}async function U(e,n,r){await H(n,async n=>{let{error:r}=await t.from(e).upsert(n,{onConflict:`id`,ignoreDuplicates:!0});if(r)throw Error(`${e}: ${r.message}`)},r)}var W=e=>(e??``).trim().toLowerCase(),G=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function K(e){let t=await y(),n=new Set(t.map(e=>W(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(G)),i=[];for(let t of e){let e=W(t.email);(e?n.has(e):r.has(G(t)))||(e?n.add(e):r.add(G(t)),i.push({...t,email:e||null}))}return{nuovi:i,saltati:e.length-i.length}}async function q(e,n){let{nuovi:r,saltati:i}=await K(e);return await H(r,async e=>{let{error:n}=await t.from(`contatti`).insert(e);if(n)throw Error(`contatti: ${n.message}`)},e=>n(`Contatti: ${e} di ${r.length}`)),{inseriti:r.length,saltati:i}}async function J(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await U(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await U(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await U(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await q(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function Y(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var X={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function Z(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>X[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var Q=c();function $(){let{email:e,nome:t}=g(),[n,r]=(0,z.useState)([]),[i,a]=(0,z.useState)(null),s=window.matchMedia(`(display-mode: standalone)`).matches;return(0,z.useEffect)(()=>{p().then(r).catch(()=>{});let e=e=>{e.preventDefault(),a(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{className:`testata`,children:(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,Q.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,Q.jsxs)(`div`,{className:`chips a-capo solo-telefono`,style:{marginBottom:14},children:[(0,Q.jsx)(`button`,{className:`chip`,onClick:()=>x(`documenti`),children:`Documenti e link`}),(0,Q.jsx)(`button`,{className:`chip`,onClick:()=>x(`contatti`),children:`Contatti & Partner`}),(0,Q.jsx)(`button`,{className:`chip`,onClick:()=>x(`report`),children:`Report`}),(0,Q.jsx)(`button`,{className:`chip`,onClick:()=>x(`ricerca`),children:`Ricerca automatica`})]}),(0,Q.jsxs)(`div`,{className:`griglia-campi imp-riquadri`,children:[(0,Q.jsxs)(o,{titolo:`Il tuo accesso`,chiave:`imp.accesso`,riassunto:e,children:[(0,Q.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,Q.jsx)(`strong`,{children:e}),`.`]}),(0,Q.jsx)(`p`,{className:`piccolo`,children:`Resti collegato su questo dispositivo finché non esci.`}),(0,Q.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>C(),children:[(0,Q.jsx)(M,{size:15}),` Esci`]})]}),(0,Q.jsx)(o,{titolo:`L’app sul telefono`,chiave:`imp.app`,riassunto:s?`Installata su questo dispositivo`:`Come aggiungerla alla schermata Home`,children:s?(0,Q.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(`p`,{className:`aiuto`,children:[(0,Q.jsx)(I,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,Q.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,Q.jsxs)(`li`,{children:[(0,Q.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,Q.jsxs)(`li`,{children:[(0,Q.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),i&&(0,Q.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>i.prompt(),children:`Installa su questo dispositivo`})]})}),(0,Q.jsx)(o,{titolo:`Notifiche sul telefono`,chiave:`imp.notifiche`,riassunto:`Quando un lead risponde, anche ad app chiusa`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(k,{})})}),(0,Q.jsx)(o,{titolo:`La coda di ogni giorno`,chiave:`imp.coda`,riassunto:`Quante bozze al giorno e chi viene per primo`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(re,{})})}),(0,Q.jsx)(o,{titolo:`Agente delle risposte`,chiave:`imp.agente`,riassunto:`Cosa fa e le regole che ha imparato`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(ie,{})})}),(0,Q.jsx)(o,{titolo:`Il Postino (bozze Gmail)`,chiave:`imp.postino`,riassunto:`Lo script nel Gmail del teatro: copia il codice`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(oe,{})})}),(0,Q.jsx)(o,{titolo:`Sicurezza della posta`,chiave:`imp.posta`,riassunto:`Le email del teatro superano i controlli?`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(ae,{})})}),(0,Q.jsx)(o,{titolo:`Prezzi e numeri nei messaggi`,chiave:`imp.prezzi`,riassunto:`Le cifre che usano messaggi e risposte`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(ee,{})})}),(0,Q.jsx)(o,{titolo:`Import dal vecchio CRM`,chiave:`imp.import`,riassunto:`Carica il file preparato da Claude`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(te,{})})}),(0,Q.jsx)(o,{titolo:`Aggiungi contatti da un file`,chiave:`imp.csv`,riassunto:`Un CSV esportato da Excel`,children:(0,Q.jsx)(`div`,{className:`imp-dentro`,children:(0,Q.jsx)(ne,{})})}),(0,Q.jsxs)(o,{titolo:`Chi può entrare`,chiave:`imp.utenti`,riassunto:n.length?`${n.length} ${n.length===1?`persona`:`persone`}`:void 0,children:[(0,Q.jsx)(`div`,{className:`lista`,children:n.map(e=>(0,Q.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,Q.jsx)(w,{size:16,style:{color:`var(--brass)`}}),(0,Q.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,Q.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,Q.jsx)(`p`,{className:`piccolo`,children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,Q.jsxs)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:[`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`,(0,Q.jsx)(`br`,{}),S()]}),(0,Q.jsx)(`p`,{style:{textAlign:`center`},children:(0,Q.jsx)(`button`,{className:`btn btn-piccolo`,onClick:()=>void O(),children:`Ricarica l’app da capo`})})]})]})}function ee(){let{condizioni:e,mettiCondizioni:t}=g(),[n,r]=(0,z.useState)(e),[a,o]=(0,z.useState)(!1),[s,c]=(0,z.useState)(null),l=d.some(({chiave:t})=>n[t]!==e[t]);(0,z.useEffect)(()=>r(e),[e]);async function u(e){e.preventDefault();let r=Object.fromEntries(Object.entries(n).map(([e,t])=>[e,t.trim()]));o(!0),c(null);try{await h(r),t(r),i(`Salvato: i prossimi messaggi usano questi dati`)}catch{c(`Non riesco a salvarli, riprova.`)}finally{o(!1)}}return(0,Q.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:u,children:[(0,Q.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,Q.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,Q.jsx)(`div`,{className:`griglia-campi due`,children:d.map(({chiave:e,etichetta:t,esempio:i})=>(0,Q.jsxs)(`label`,{className:`campo`,children:[(0,Q.jsx)(`span`,{children:t}),(0,Q.jsx)(`input`,{className:`input`,value:n[e],placeholder:i,onChange:t=>r({...n,[e]:t.target.value})})]},e))}),(0,Q.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!l,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,Q.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),s&&(0,Q.jsx)(`div`,{className:`errore-box`,role:`alert`,children:s})]})}function te(){let{ricarica:e}=g(),[t,n]=(0,z.useState)(null),[r,a]=(0,z.useState)(``),[o,s]=(0,z.useState)(null),[c,l]=(0,z.useState)(null),[u,d]=(0,z.useState)(null),[f,p]=(0,z.useState)(!1);async function m(e){let t=e.target.files?.[0];if(e.target.value=``,t){d(null),l(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),a(t.name)}catch{n(null),d(`Questo file non è un pacchetto di import valido.`)}}}async function h(){if(t){p(!0),d(null);try{let r=await J(t,s);l(r),n(null),await e(),i(`Import completato`)}catch(e){d(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{p(!1),s(null)}}}return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,Q.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,Q.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,Q.jsx)(R,{size:15}),` Scegli il file .json`,(0,Q.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:m,hidden:!0})]}),t&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,Q.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,Q.jsx)(`button`,{className:`btn btn-primario`,onClick:h,disabled:f,children:f?`Importo…`:`Importa adesso`})]}),o&&(0,Q.jsx)(`p`,{className:`piccolo`,role:`status`,children:o}),c&&(0,Q.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,c.leads,` lead, `,c.interazioni,` interazioni, `,c.bozze,` messaggi, `,c.contatti,` contatti nuovi`,c.contattiSaltati?` (${c.contattiSaltati} erano già in rubrica)`:``,`.`]}),u&&(0,Q.jsx)(`div`,{className:`errore-box`,role:`alert`,children:u})]})}function ne(){let{ricarica:t}=g(),[n,r]=(0,z.useState)(null),[a,o]=(0,z.useState)(``),[s,c]=(0,z.useState)(`hotel`),[l,u]=(0,z.useState)(``),[d,f]=(0,z.useState)(null),[p,m]=(0,z.useState)(null),[h,_]=(0,z.useState)(!1),v=()=>n?Z(n,s,l.trim()||null).contatti:[];(0,z.useEffect)(()=>{if(!n)return;let{contatti:e,colonne:t}=Z(n,s,l.trim()||null);K(e).then(({nuovi:n})=>f({totale:e.length,nuovi:n.length,colonne:t})).catch(()=>f({totale:e.length,nuovi:e.length,colonne:t}))},[n,s,l]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;m(null);let n=Y(await t.text());if(n.length<2){m(`Il file sembra vuoto.`);return}r(n),o(t.name)}async function b(){_(!0);try{let e=await q(v(),()=>{});i(`${e.inseriti} contatti aggiunti${e.saltati?`, ${e.saltati} già presenti`:``}`),r(null),f(null),await t()}catch(e){m(e instanceof Error?e.message:`Import non riuscito.`)}finally{_(!1)}}return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,Q.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,Q.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,Q.jsx)(R,{size:15}),` Scegli il file .csv`,(0,Q.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),n&&d&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,Q.jsx)(`strong`,{children:a}),`: `,d.totale,` righe, di cui `,(0,Q.jsxs)(`strong`,{children:[d.nuovi,` nuove`]}),`. Colonne riconosciute: `,d.colonne.join(`, `)||`nessuna`,`.`]}),(0,Q.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,Q.jsxs)(`label`,{className:`campo`,children:[(0,Q.jsx)(`span`,{children:`Categoria`}),(0,Q.jsx)(`select`,{className:`input`,value:s,onChange:e=>c(e.target.value),children:e.map(e=>(0,Q.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,Q.jsxs)(`label`,{className:`campo`,children:[(0,Q.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,Q.jsx)(`input`,{className:`input`,value:l,onChange:e=>u(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,Q.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:h||!d.nuovi,children:h?`Aggiungo…`:`Aggiungi ${d.nuovi} contatti`})]}),p&&(0,Q.jsx)(`div`,{className:`errore-box`,role:`alert`,children:p})]})}function re(){let{coda:e,mettiCoda:t}=g(),[n,r]=(0,z.useState)(String(e.quanti)),[a,o]=(0,z.useState)(e.verticali),[c,l]=(0,z.useState)(String(e.tetto)),[u,d]=(0,z.useState)(!1),f=Number(n)!==e.quanti||Number(c)!==e.tetto||a.join()!==e.verticali.join(),p=e=>o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function m(){let e=Math.min(40,Math.max(1,Math.trunc(Number(n))||10));d(!0);try{let n=Math.min(100,Math.max(5,Math.trunc(Number(c))||30)),o={quanti:e,verticali:a,tetto:n};await _(o),t(o),r(String(e)),l(String(n)),i(`Coda aggiornata`)}catch{i(`Non riesco a salvare, riprova`)}d(!1)}return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,Q.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,Q.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,Q.jsx)(`span`,{children:`Bozze al giorno`}),(0,Q.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:n,onChange:e=>r(e.target.value)})]}),(0,Q.jsxs)(`label`,{className:`campo`,style:{maxWidth:320},children:[(0,Q.jsx)(`span`,{children:`Massimo di email inviate al giorno`}),(0,Q.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:5,max:100,value:c,onChange:e=>l(e.target.value)}),(0,Q.jsx)(`span`,{className:`piccolo`,children:`Primi contatti e follow-up insieme. Con un Gmail giovane, oltre 30 al giorno con testi simili si rischia lo spam.`})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,Q.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(s).map(([e,t])=>{let n=a.indexOf(e);return(0,Q.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>p(e),"aria-pressed":n>=0,children:[n>=0&&(0,Q.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,Q.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:m,disabled:!f||u,children:u?`Salvo…`:`Salva`})]})}function ie(){let[e,t]=(0,z.useState)(null);(0,z.useEffect)(()=>{u().then(t).catch(()=>t([]))},[]);async function n(n){if(!e||!window.confirm(`Tolgo questa regola? L’agente non la userà più.`))return;let r=e.filter((e,t)=>t!==n);try{await b(r),t(r),i(`Regola tolta`)}catch{i(`Non riesco a salvare, riprova`)}}return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsxs)(`div`,{className:`etichetta`,children:[(0,Q.jsx)(D,{size:15,style:{verticalAlign:`-3px`}}),` Agente delle risposte`]}),(0,Q.jsx)(`p`,{className:`aiuto`,children:`Ogni 2 ore, dalle 8:30 alle 20:30, legge le risposte dei lead con tutta la conversazione e scrive la risposta: la trovi tra le bozze di Gmail, sotto il loro messaggio. Non invia mai niente. Eventi privati e preventivi li segnala per Matteo. Quando correggi una sua bozza prima di inviarla, impara la differenza: qui sotto le regole che ha ricavato.`})]}),e===null?(0,Q.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):e.length?(0,Q.jsx)(`div`,{className:`lista`,children:e.map((e,t)=>(0,Q.jsxs)(`div`,{className:`fila`,style:{justifyContent:`space-between`,gap:10},children:[(0,Q.jsxs)(`span`,{style:{fontSize:14},children:[e.regola,e.il?(0,Q.jsxs)(`span`,{className:`piccolo`,children:[` · `,e.il]}):null]}),(0,Q.jsx)(`button`,{className:`btn-testo`,onClick:()=>n(t),"aria-label":`Togli questa regola`,children:`Togli`})]},`${t}-${e.regola}`))}):(0,Q.jsx)(`p`,{className:`piccolo`,children:`Ancora nessuna regola: le impara dalle prime bozze che correggi e invii.`})]})}function ae(){let[e,t]=(0,z.useState)(void 0);(0,z.useEffect)(()=>{f().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),i=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),a=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),o=r?Math.round(i/r*100):0,s=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,Q.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,Q.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,Q.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,Q.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,Q.jsx)(P,{size:22,style:{color:o>=95?`var(--ok)`:`var(--warn)`}}),(0,Q.jsxs)(`span`,{style:{fontSize:15},children:[(0,Q.jsxs)(`strong`,{children:[o,`%`]}),` dei `,r,` messaggi `,s?`dal ${s} `:``,`ha superato i controlli.`]})]}),a.length>0&&(0,Q.jsx)(`div`,{className:`nota-box`,children:(0,Q.jsxs)(`span`,{children:[a.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,a.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function oe(){let[e,t]=(0,z.useState)(void 0),[r,a]=(0,z.useState)(null);(0,z.useEffect)(()=>{v(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0)),m().then(e=>a(e?.versione??null)).catch(()=>{})},[]);let o=E(r);return(0,Q.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,Q.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,Q.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,Q.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,Q.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,o===`da_rincollare`?(0,Q.jsxs)(`strong`,{style:{color:`var(--warn)`},children:[`da aggiornare (nel Gmail c’è la versione `,r,`, qui la `,A,`)`]}):o===`app_vecchia`?(0,Q.jsxs)(`strong`,{style:{color:`var(--warn)`},children:[`il Gmail ha già la versione `,r,`: questa app è vecchia, chiudila e riaprila prima di copiare`]}):e===void 0?`non lo so ancora`:e?(0,Q.jsxs)(`strong`,{style:{color:`var(--ok)`},children:[`aggiornato e attivo ✓`,o===`uguale`?` (versione ${r})`:``]}):(0,Q.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,Q.jsxs)(`details`,{children:[(0,Q.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,Q.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,Q.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,Q.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,Q.jsxs)(`li`,{children:[`Apri `,(0,Q.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,Q.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,Q.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,Q.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,Q.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,Q.jsx)(`strong`,{children:`installa`}),` e premi `,(0,Q.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,Q.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>{if(o===`app_vecchia`){T(),i(`Questa app è vecchia: chiudila e riaprila prima di copiare il Postino`,{tono:`errore`,dettaglio:`Nel Gmail gira già la versione ${r}, questa pagina ha la ${A}.`});return}n(B,`Codice copiato: incollalo nello script`)},disabled:o===`app_vecchia`,children:[(0,Q.jsx)(l,{size:15}),` Copia il codice`]})]})}export{$ as Impostazioni};
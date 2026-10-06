import{At as e,Bt as t,G as n,K as r,S as i,b as a,gt as o,mt as s,n as c,o as l,r as u,s as d,tt as f,v as p,vt as m,zt as h}from"./avvisi-BZ9e1p1c.js";import{t as g}from"./copy-B5ZT1cCP.js";import{A as _,t as v}from"./index-D9iiIxSa.js";var y={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};y.node;var b=h(y),x={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};x.node;var S=h(x),C={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};C.node;var w=h(C),T={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};T.node;var E=h(T),D={name:`users`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};D.node;var O=h(D),k=t(),A=`/**\r
 * Postino del CRM — Teatro Nazionale Firenze\r
 *\r
 * Vive nel Gmail teatronazionalefirenze@gmail.com (quello che importa info@ via POP3). Fa questi lavori, tutti senza\r
 * Claude (continua a funzionare anche quando i crediti finiscono):\r
 *\r
 * 1. Ogni 5 minuti manda al CRM i messaggi arrivati negli ultimi 2 giorni che non ha ancora mandato.\r
 *    Il CRM tiene SOLO le risposte dei lead e i rimbalzi; tutto il resto lo ignora e non lo salva.\r
 *\r
 * 2. Ogni minuto controlla se nel CRM c'è una bozza «da mettere in Gmail» e la crea tra le BOZZE di Gmail, pronta da\r
 *    inviare anche dal telefono. NON la invia mai.\r
 *\r
 * 3. Ogni minuto (dalle 7 alle 23) guarda i messaggi che hai INVIATO nell'ultima ora dal Gmail del teatro: se sono\r
 *    diretti a un lead, il CRM lo segna «contattato» e fissa il follow-up, e l'app te lo conferma subito. Ogni 15 minuti\r
 *    ripassa gli ultimi 3 giorni, per non perdere niente (anche quello che invii di notte).\r
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
 * 8. Ogni 5 minuti sposta rimbalzi, avvisi di mancata consegna e report DMARC già letti dal CRM fuori dalla posta in\r
 *    arrivo, sotto l'etichetta «Sistema (rimbalzi e DMARC)»: non confondono più chi legge la posta.\r
 *\r
 * Questo script NON invia email e NON cancella nulla: legge, crea bozze e archivia la sola posta di sistema. Su Drive scrive solo dentro la\r
 * sua cartella di backup, non tocca nient'altro.\r
 *\r
 * La chiave la crea lo script stesso al primo avvio (proprietà CHIAVE_POSTINO) e la registra una volta sul\r
 * CRM: nessuno deve copiarla o incollarla. Il CRM accetta la registrazione solo se è stata aperta a mano.\r
 *\r
 * Installazione / aggiornamento: incolla il codice ed esegui «installa» una volta (Google chiede l'autorizzazione:\r
 * accetta tutto, serve per leggere la posta e creare bozze).\r
 */\r
const INDIRIZZO_CRM = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/agente-ricerca';\r
const CARTELLA_BACKUP = 'CRM Teatro — Backup';\r
const SETTIMANE_DA_TENERE = 10;\r
// Le bozze partono dall'indirizzo del teatro (alias «Invia come» del Gmail, via SMTP Aruba), non dal Gmail: così il\r
// destinatario vede il dominio vero e le risposte arrivano in info@ (visibili anche in Outlook). Se l'alias non c'è,\r
// la bozza nasce dal Gmail come prima.\r
const MITTENTE = 'info@teatronazionalefirenze.it';\r
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
function controllaPosta() {\r
  const props = PropertiesService.getScriptProperties();\r
  chiaveOStop();\r
\r
  // Ultimi messaggi già mandati: così ogni messaggio parte una volta sola.\r
  const visti = JSON.parse(props.getProperty('VISTI') || '[]');\r
  const giaVisti = new Set(visti);\r
  const nuovi = [];\r
  GmailApp.search('in:inbox newer_than:2d', 0, 100).forEach(function (thread) {\r
    thread.getMessages().forEach(function (m) {\r
      const id = m.getId();\r
      if (giaVisti.has(id) || m.isDraft()) return;\r
      nuovi.push({\r
        id: id,\r
        da: m.getFrom(),\r
        a: indirizziIn(m.getTo()),\r
        cc: indirizziIn(m.getCc()),\r
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
    lotto.forEach(function (m) { visti.push(m.id); });\r
  }\r
  props.setProperty('VISTI', JSON.stringify(visti.slice(-400)));\r
  riordinaSistema();\r
}\r
\r
// ---------- bozze Gmail ----------\r
\r
/** Ogni minuto, di giorno: crea le bozze in coda e controlla gli invii dell'ultima ora (conferma quasi immediata\r
 *  nell'app). Di notte si ferma per non consumare la quota giornaliera di Google; il ripasso ogni 15 minuti resta. */\r
function ogniMinuto() {\r
  const ora = Number(Utilities.formatDate(new Date(), 'Europe/Rome', 'H'));\r
  if (ora < 7 || ora >= 23) return;\r
  const lock = LockService.getScriptLock();\r
  if (!lock.tryLock(5000)) return; // un altro giro è ancora in corso\r
  try {\r
    creaBozzeInCoda();\r
    inviatiDa('in:sent newer_than:1h');\r
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
    creaBozzeInCoda();\r
  } finally {\r
    lock.releaseLock();\r
  }\r
}\r
\r
/** Vero se nel Gmail è attivo «Invia come» info@teatronazionalefirenze.it. */\r
function aliasTeatro() {\r
  return GmailApp.getAliases().some(function (x) { return x.toLowerCase() === MITTENTE; });\r
}\r
\r
function creaBozzeInCoda() {\r
  {\r
    const coda = (chiamaCrm('bozze_in_coda').bozze) || [];\r
    if (!coda.length) return;\r
    const fatte = [];\r
    const errori = [];\r
    coda.forEach(function (b) {\r
      try {\r
        const opzioni = b.html ? { htmlBody: b.html } : {};\r
        if (aliasTeatro()) { opzioni.from = MITTENTE; opzioni.name = NOME_MITTENTE; }\r
        let bozza = null;\r
        // Risposta a un messaggio ricevuto: la bozza nasce dentro la stessa conversazione.\r
        if (b.rispondi_a) {\r
          try { bozza = GmailApp.getMessageById(b.rispondi_a).createDraftReply(b.testo || '', opzioni); } catch (er) { bozza = null; }\r
        }\r
        if (!bozza) bozza = GmailApp.createDraft(b.a, b.oggetto || '', b.testo || '', opzioni);\r
        fatte.push({ id: b.id, draft_id: bozza.getId() });\r
      } catch (e) {\r
        errori.push({ id: b.id, errore: String(e).slice(0, 280) });\r
      }\r
    });\r
    chiamaCrm('bozze_fatte', { fatte: fatte, errori: errori });\r
  }\r
}\r
\r
// ---------- messaggi inviati ----------\r
\r
function indirizziIn(testo) {\r
  return (String(testo || '').match(/[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+/g) || []).map(function (e) { return e.toLowerCase(); });\r
}\r
\r
/** Ogni 15 minuti: ripasso degli invii degli ultimi 3 giorni (il controllo veloce, ogni minuto, guarda solo l'ultima ora). */\r
function controllaInviati() {\r
  const lock = LockService.getScriptLock();\r
  if (!lock.tryLock(20000)) return;\r
  try {\r
    inviatiDa('in:sent newer_than:3d');\r
  } finally {\r
    lock.releaseLock();\r
  }\r
  rileggiConversazioni();\r
  rileggiTeam();\r
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
  const fili = GmailApp.search(cosa.ricerca, da, PASSO);\r
  const pacchi = [];\r
  fili.forEach(function (thread) {\r
    const ultimo = thread.getLastMessageDate().getTime();\r
    if (visti[thread.getId()] === ultimo) return; // niente di nuovo in questa conversazione\r
    const messaggi = thread.getMessages().filter(function (m) { return !m.isDraft(); }).slice(-30).map(function (m) {\r
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
    pacchi.push({ id: thread.getId(), totale: thread.getMessageCount(), messaggi: messaggi, ultimo: ultimo });\r
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
  const letture = daLeggere.map(function (l) {\r
    const messaggi = [];\r
    GmailApp.search(l.ricerca, 0, 15).forEach(function (thread) {\r
      thread.getMessages().forEach(function (m) {\r
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
  const miei = [Session.getEffectiveUser().getEmail() || ''].concat(GmailApp.getAliases())\r
    .map(function (x) { return x.toLowerCase(); }).filter(function (x) { return x; });\r
  const limite = new Date(Date.now() - 3 * 86400000);\r
  const visti = JSON.parse(props.getProperty('VISTI_INVIATI') || '[]');\r
  const giaVisti = new Set(visti);\r
  const nuovi = [];\r
  GmailApp.search(ricerca, 0, 100).forEach(function (thread) {\r
    thread.getMessages().forEach(function (m) {\r
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
  const etichetta = GmailApp.getUserLabelByName(ETICHETTA_SISTEMA) || GmailApp.createLabel(ETICHETTA_SISTEMA);\r
  GmailApp.search(RICERCA_SISTEMA, 0, 100).forEach(function (thread) {\r
    const messaggi = thread.getMessages();\r
    // Una conversazione con un nostro invio e il suo rimbalzo: si sposta solo se tutti i messaggi in arrivo sono di sistema.\r
    const altri = messaggi.some(function (m) {\r
      const da = m.getFrom().toLowerCase();\r
      return !m.isDraft() && !/mailer-daemon|postmaster|dmarc|mimecastreport/.test(da) && !/teatronazionalefirenze/.test(da) && !/report domain/i.test(m.getSubject());\r
    });\r
    if (altri) return;\r
    const pronti = messaggi.every(function (m) {\r
      return letti.has(m.getId()) || m.getDate().getTime() < vecchio || /teatronazionalefirenze/.test(m.getFrom().toLowerCase());\r
    });\r
    if (!pronti) return;\r
    thread.addLabel(etichetta);\r
    thread.moveToArchive();\r
  });\r
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
function controllaDmarc() {\r
  const props = PropertiesService.getScriptProperties();\r
  chiaveOStop();\r
  const visti = JSON.parse(props.getProperty('DMARC_VISTI') || '[]');\r
  const giaVisti = new Set(visti);\r
  const rapporti = [];\r
  const nuoviId = [];\r
  GmailApp.search('subject:"Report Domain" OR subject:"Report domain" has:attachment newer_than:14d', 0, 40).forEach(function (thread) {\r
    thread.getMessages().forEach(function (m) {\r
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
`,j=100;async function M(e,t,n){for(let r=0;r<e.length;r+=j)await t(e.slice(r,r+j)),n(Math.min(r+j,e.length))}async function N(e,t,n){await M(t,async t=>{let{error:n}=await o.from(e).upsert(t,{onConflict:`id`,ignoreDuplicates:!0});if(n)throw Error(`${e}: ${n.message}`)},n)}var P=e=>(e??``).trim().toLowerCase(),F=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function I(e){let t=await a(),n=new Set(t.map(e=>P(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(F)),i=[];for(let t of e){let e=P(t.email);(e?n.has(e):r.has(F(t)))||(e?n.add(e):r.add(F(t)),i.push({...t,email:e||null}))}return{nuovi:i,saltati:e.length-i.length}}async function L(e,t){let{nuovi:n,saltati:r}=await I(e);return await M(n,async e=>{let{error:t}=await o.from(`contatti`).insert(e);if(t)throw Error(`contatti: ${t.message}`)},e=>t(`Contatti: ${e} di ${n.length}`)),{inseriti:n.length,saltati:r}}async function R(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await N(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await N(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await N(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await L(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function z(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var B={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function V(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>B[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var H=d();function U(){let{email:e,nome:t}=l(),[n,r]=(0,k.useState)([]),[i,a]=(0,k.useState)(null),o=window.matchMedia(`(display-mode: standalone)`).matches;return(0,k.useEffect)(()=>{f().then(r).catch(()=>{});let e=e=>{e.preventDefault(),a(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(`div`,{className:`testata`,children:(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,H.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,H.jsxs)(`div`,{className:`griglia-campi`,children:[(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Il tuo accesso`}),(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,H.jsx)(`strong`,{children:e}),`.`]}),(0,H.jsx)(`p`,{className:`piccolo`,style:{marginTop:4},children:`Resti collegato su questo dispositivo finché non esci.`}),(0,H.jsxs)(`button`,{className:`btn btn-piccolo`,style:{marginTop:12},onClick:()=>_(),children:[(0,H.jsx)(b,{size:15}),` Esci`]})]}),(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`L’app sul telefono`}),o?(0,H.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{className:`aiuto`,children:[(0,H.jsx)(w,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,H.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,H.jsxs)(`li`,{children:[(0,H.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,H.jsxs)(`li`,{children:[(0,H.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),i&&(0,H.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>i.prompt(),children:`Installa su questo dispositivo`})]})]}),(0,H.jsx)(v,{}),(0,H.jsx)(q,{}),(0,H.jsx)(Y,{}),(0,H.jsx)(J,{}),(0,H.jsx)(W,{}),(0,H.jsx)(G,{}),(0,H.jsx)(K,{}),(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Chi può entrare`}),(0,H.jsx)(`div`,{className:`lista`,children:n.map(e=>(0,H.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,H.jsx)(O,{size:16,style:{color:`var(--brass)`}}),(0,H.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,H.jsx)(`p`,{className:`piccolo`,style:{marginTop:10},children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,H.jsx)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`})]})]})}function W(){let{condizioni:e,mettiCondizioni:t}=l(),[n,i]=(0,k.useState)(e),[a,o]=(0,k.useState)(!1),[u,d]=(0,k.useState)(null),f=s.some(({chiave:t})=>n[t]!==e[t]);(0,k.useEffect)(()=>i(e),[e]);async function p(e){e.preventDefault();let i=Object.fromEntries(Object.entries(n).map(([e,t])=>[e,t.trim()]));o(!0),d(null);try{await r(i),t(i),c(`Salvato: i prossimi messaggi usano questi dati`)}catch{d(`Non riesco a salvarli, riprova.`)}finally{o(!1)}}return(0,H.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:p,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,H.jsx)(`div`,{className:`griglia-campi due`,children:s.map(({chiave:e,etichetta:t,esempio:r})=>(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:t}),(0,H.jsx)(`input`,{className:`input`,value:n[e],placeholder:r,onChange:t=>i({...n,[e]:t.target.value})})]},e))}),(0,H.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!f,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,H.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),u&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:u})]})}function G(){let{ricarica:e}=l(),[t,n]=(0,k.useState)(null),[r,i]=(0,k.useState)(``),[a,o]=(0,k.useState)(null),[s,u]=(0,k.useState)(null),[d,f]=(0,k.useState)(null),[p,m]=(0,k.useState)(!1);async function h(e){let t=e.target.files?.[0];if(e.target.value=``,t){f(null),u(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),i(t.name)}catch{n(null),f(`Questo file non è un pacchetto di import valido.`)}}}async function g(){if(t){m(!0),f(null);try{let r=await R(t,o);u(r),n(null),await e(),c(`Import completato`)}catch(e){f(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{m(!1),o(null)}}}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,H.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,H.jsx)(E,{size:15}),` Scegli il file .json`,(0,H.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:h,hidden:!0})]}),t&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,H.jsx)(`button`,{className:`btn btn-primario`,onClick:g,disabled:p,children:p?`Importo…`:`Importa adesso`})]}),a&&(0,H.jsx)(`p`,{className:`piccolo`,role:`status`,children:a}),s&&(0,H.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,s.leads,` lead, `,s.interazioni,` interazioni, `,s.bozze,` messaggi, `,s.contatti,` contatti nuovi`,s.contattiSaltati?` (${s.contattiSaltati} erano già in rubrica)`:``,`.`]}),d&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:d})]})}function K(){let{ricarica:e}=l(),[t,n]=(0,k.useState)(null),[r,i]=(0,k.useState)(``),[a,o]=(0,k.useState)(`hotel`),[s,u]=(0,k.useState)(``),[d,f]=(0,k.useState)(null),[p,h]=(0,k.useState)(null),[g,_]=(0,k.useState)(!1),v=()=>t?V(t,a,s.trim()||null).contatti:[];(0,k.useEffect)(()=>{if(!t)return;let{contatti:e,colonne:n}=V(t,a,s.trim()||null);I(e).then(({nuovi:t})=>f({totale:e.length,nuovi:t.length,colonne:n})).catch(()=>f({totale:e.length,nuovi:e.length,colonne:n}))},[t,a,s]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;h(null);let r=z(await t.text());if(r.length<2){h(`Il file sembra vuoto.`);return}n(r),i(t.name)}async function b(){_(!0);try{let t=await L(v(),()=>{});c(`${t.inseriti} contatti aggiunti${t.saltati?`, ${t.saltati} già presenti`:``}`),n(null),f(null),await e()}catch(e){h(e instanceof Error?e.message:`Import non riuscito.`)}finally{_(!1)}}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,H.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,H.jsx)(E,{size:15}),` Scegli il file .csv`,(0,H.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),t&&d&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:r}),`: `,d.totale,` righe, di cui `,(0,H.jsxs)(`strong`,{children:[d.nuovi,` nuove`]}),`. Colonne riconosciute: `,d.colonne.join(`, `)||`nessuna`,`.`]}),(0,H.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:`Categoria`}),(0,H.jsx)(`select`,{className:`input`,value:a,onChange:e=>o(e.target.value),children:m.map(e=>(0,H.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,H.jsx)(`input`,{className:`input`,value:s,onChange:e=>u(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,H.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:g||!d.nuovi,children:g?`Aggiungo…`:`Aggiungi ${d.nuovi} contatti`})]}),p&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:p})]})}function q(){let{coda:t,mettiCoda:r}=l(),[i,a]=(0,k.useState)(String(t.quanti)),[o,s]=(0,k.useState)(t.verticali),[u,d]=(0,k.useState)(String(t.tetto)),[f,p]=(0,k.useState)(!1),m=Number(i)!==t.quanti||Number(u)!==t.tetto||o.join()!==t.verticali.join(),h=e=>s(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function g(){let e=Math.min(40,Math.max(1,Math.trunc(Number(i))||10));p(!0);try{let t=Math.min(100,Math.max(5,Math.trunc(Number(u))||30)),i={quanti:e,verticali:o,tetto:t};await n(i),r(i),a(String(e)),d(String(t)),c(`Coda aggiornata`)}catch{c(`Non riesco a salvare, riprova`)}p(!1)}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,H.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,H.jsx)(`span`,{children:`Bozze al giorno`}),(0,H.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:i,onChange:e=>a(e.target.value)})]}),(0,H.jsxs)(`label`,{className:`campo`,style:{maxWidth:320},children:[(0,H.jsx)(`span`,{children:`Massimo di email inviate al giorno`}),(0,H.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:5,max:100,value:u,onChange:e=>d(e.target.value)}),(0,H.jsx)(`span`,{className:`piccolo`,children:`Primi contatti e follow-up insieme. Con un Gmail giovane, oltre 30 al giorno con testi simili si rischia lo spam.`})]}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,H.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(e).map(([e,t])=>{let n=o.indexOf(e);return(0,H.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>h(e),"aria-pressed":n>=0,children:[n>=0&&(0,H.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,H.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:g,disabled:!m||f,children:f?`Salvo…`:`Salva`})]})}function J(){let[e,t]=(0,k.useState)(void 0);(0,k.useEffect)(()=>{i().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),a=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),o=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),s=r?Math.round(a/r*100):0,c=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,H.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,H.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,H.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,H.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,H.jsx)(S,{size:22,style:{color:s>=95?`var(--ok)`:`var(--warn)`}}),(0,H.jsxs)(`span`,{style:{fontSize:15},children:[(0,H.jsxs)(`strong`,{children:[s,`%`]}),` dei `,r,` messaggi `,c?`dal ${c} `:``,`ha superato i controlli.`]})]}),o.length>0&&(0,H.jsx)(`div`,{className:`nota-box`,children:(0,H.jsxs)(`span`,{children:[o.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,o.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function Y(){let[e,t]=(0,k.useState)(void 0);return(0,k.useEffect)(()=>{p(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0))},[]),(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,H.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,H.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,H.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,H.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,e===void 0?`non lo so ancora`:e?(0,H.jsx)(`strong`,{style:{color:`var(--ok)`},children:`aggiornato e attivo ✓`}):(0,H.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,H.jsxs)(`details`,{children:[(0,H.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,H.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,H.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,H.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,H.jsxs)(`li`,{children:[`Apri `,(0,H.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,H.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,H.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,H.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,H.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,H.jsx)(`strong`,{children:`installa`}),` e premi `,(0,H.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,H.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>u(A,`Codice copiato: incollalo nello script`),children:[(0,H.jsx)(g,{size:15}),` Copia il codice`]})]})}export{U as Impostazioni};
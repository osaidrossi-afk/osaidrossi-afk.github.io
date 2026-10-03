import{H as e,Nt as t,Pt as n,V as r,Y as i,b as a,ct as o,ft as s,g as c,n as l,o as u,r as d,s as f,ut as p,v as m,wt as h}from"./avvisi-DFb4F0Ir.js";import{t as g}from"./copy-Cis23nN9.js";import{T as _,t as v}from"./index-3kYMzu4L.js";var y={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};y.node;var b=t(y),x={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};x.node;var S=t(x),C={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};C.node;var w=t(C),T={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};T.node;var E=t(T),D={name:`users`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};D.node;var O=t(D),k=n(),A=`/**
 * Postino del CRM — Teatro Nazionale Firenze
 *
 * Vive nel Gmail teatronazionalefirenze@gmail.com (quello che importa info@ via POP3). Fa questi lavori, tutti senza
 * Claude (continua a funzionare anche quando i crediti finiscono):
 *
 * 1. Ogni 5 minuti manda al CRM i messaggi arrivati negli ultimi 2 giorni che non ha ancora mandato.
 *    Il CRM tiene SOLO le risposte dei lead e i rimbalzi; tutto il resto lo ignora e non lo salva.
 *
 * 2. Ogni minuto controlla se nel CRM c'è una bozza «da mettere in Gmail» e la crea tra le BOZZE di Gmail, pronta da
 *    inviare anche dal telefono. NON la invia mai.
 *
 * 3. Ogni minuto (dalle 7 alle 23) guarda i messaggi che hai INVIATO nell'ultima ora dal Gmail del teatro: se sono
 *    diretti a un lead, il CRM lo segna «contattato» e fissa il follow-up, e l'app te lo conferma subito. Ogni 15 minuti
 *    ripassa gli ultimi 3 giorni, per non perdere niente (anche quello che invii di notte).
 *
 * 4. Ogni mattina legge i report DMARC arrivati (allegati compressi che il CRM da solo non apre) e manda al CRM un
 *    riassunto: dice se le email spedite con l'indirizzo del dominio superano i controlli di sicurezza.
 *
 * 5. Ogni lunedì mattina scarica un esportino di tutti i dati del CRM (lead, contatti, storico) e lo salva su Google
 *    Drive, cartella «CRM Teatro — Backup». Tiene solo le ultime 10 settimane, le più vecchie le cancella da sole.
 *
 * Questo script NON invia email, NON cancella e NON modifica la posta: legge e crea bozze. Su Drive scrive solo dentro la
 * sua cartella di backup, non tocca nient'altro.
 *
 * La chiave la crea lo script stesso al primo avvio (proprietà CHIAVE_POSTINO) e la registra una volta sul
 * CRM: nessuno deve copiarla o incollarla. Il CRM accetta la registrazione solo se è stata aperta a mano.
 *
 * Installazione / aggiornamento: incolla il codice ed esegui «installa» una volta (Google chiede l'autorizzazione:
 * accetta tutto, serve per leggere la posta e creare bozze).
 */
const INDIRIZZO_CRM = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/agente-ricerca';
const CARTELLA_BACKUP = 'CRM Teatro — Backup';
const SETTIMANE_DA_TENERE = 10;

/** Da eseguire UNA volta (anche di nuovo, dopo un aggiornamento del codice): rimette a posto i controlli
 *  automatici e fa subito un primo giro. */
function installa() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('CHIAVE_POSTINO')) {
    const chiave = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-postino-chiave': chiave },
      payload: JSON.stringify({ azione: 'registra' }),
      muteHttpExceptions: true,
    });
    if (r.getResponseCode() !== 200) throw new Error('Registrazione rifiutata dal CRM (' + r.getResponseCode() + '): chiedi a Claude di riaprirla');
    props.setProperty('CHIAVE_POSTINO', chiave);
  }
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('controllaPosta').timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger('ogniMinuto').timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger('controllaInviati').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('controllaDmarc').timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger('backupSettimanale').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(6).create();
  controllaPosta();
  elaboraBozze();
  controllaInviati();
  controllaDmarc();
}

function chiaveOStop() {
  const chiave = PropertiesService.getScriptProperties().getProperty('CHIAVE_POSTINO');
  if (!chiave) throw new Error('Manca CHIAVE_POSTINO: esegui prima «installa»');
  return chiave;
}

/** Chiama il CRM con la chiave del Postino e restituisce la risposta già letta come JSON. */
function chiamaCrm(azione, resto) {
  const corpo = Object.assign({ azione: azione }, resto || {});
  const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-postino-chiave': chiaveOStop() },
    payload: JSON.stringify(corpo),
    muteHttpExceptions: true,
  });
  if (r.getResponseCode() !== 200) throw new Error('CRM ha risposto ' + r.getResponseCode() + ' (' + azione + '): ' + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText());
}

function controllaPosta() {
  const props = PropertiesService.getScriptProperties();
  chiaveOStop();

  // Ultimi messaggi già mandati: così ogni messaggio parte una volta sola.
  const visti = JSON.parse(props.getProperty('VISTI') || '[]');
  const giaVisti = new Set(visti);
  const nuovi = [];
  GmailApp.search('in:inbox newer_than:2d', 0, 100).forEach(function (thread) {
    thread.getMessages().forEach(function (m) {
      const id = m.getId();
      if (giaVisti.has(id) || m.isDraft()) return;
      nuovi.push({
        id: id,
        da: m.getFrom(),
        oggetto: m.getSubject(),
        data: m.getDate().toISOString(),
        anteprima: m.getPlainBody().slice(0, 6000),
      });
    });
  });

  for (let i = 0; i < nuovi.length; i += 50) {
    const lotto = nuovi.slice(i, i + 50);
    chiamaCrm('posta', { messaggi: lotto });
    lotto.forEach(function (m) { visti.push(m.id); });
  }
  props.setProperty('VISTI', JSON.stringify(visti.slice(-400)));
}

// ---------- bozze Gmail ----------

/** Ogni minuto, di giorno: crea le bozze in coda e controlla gli invii dell'ultima ora (conferma quasi immediata
 *  nell'app). Di notte si ferma per non consumare la quota giornaliera di Google; il ripasso ogni 15 minuti resta. */
function ogniMinuto() {
  const ora = Number(Utilities.formatDate(new Date(), 'Europe/Rome', 'H'));
  if (ora < 7 || ora >= 23) return;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // un altro giro è ancora in corso
  try {
    creaBozzeInCoda();
    inviatiDa('in:sent newer_than:1h');
  } finally {
    lock.releaseLock();
  }
}

/** Le bozze «in coda» nel CRM diventano vere bozze di Gmail. Mai inviate. (Si può anche eseguire a mano.) */
function elaboraBozze() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    creaBozzeInCoda();
  } finally {
    lock.releaseLock();
  }
}

function creaBozzeInCoda() {
  {
    const coda = (chiamaCrm('bozze_in_coda').bozze) || [];
    if (!coda.length) return;
    const fatte = [];
    const errori = [];
    coda.forEach(function (b) {
      try {
        const opzioni = b.html ? { htmlBody: b.html } : {};
        let bozza = null;
        // Risposta a un messaggio ricevuto: la bozza nasce dentro la stessa conversazione.
        if (b.rispondi_a) {
          try { bozza = GmailApp.getMessageById(b.rispondi_a).createDraftReply(b.testo || '', opzioni); } catch (er) { bozza = null; }
        }
        if (!bozza) bozza = GmailApp.createDraft(b.a, b.oggetto || '', b.testo || '', opzioni);
        fatte.push({ id: b.id, draft_id: bozza.getId() });
      } catch (e) {
        errori.push({ id: b.id, errore: String(e).slice(0, 280) });
      }
    });
    chiamaCrm('bozze_fatte', { fatte: fatte, errori: errori });
  }
}

// ---------- messaggi inviati ----------

function indirizziIn(testo) {
  return (String(testo || '').match(/[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+/g) || []).map(function (e) { return e.toLowerCase(); });
}

/** Ogni 15 minuti: ripasso degli invii degli ultimi 3 giorni (il controllo veloce, ogni minuto, guarda solo l'ultima ora). */
function controllaInviati() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    inviatiDa('in:sent newer_than:3d');
  } finally {
    lock.releaseLock();
  }
}

/** I messaggi inviati dal Gmail del teatro verso i lead diventano «contatto fatto» nel CRM. */
function inviatiDa(ricerca) {
  const props = PropertiesService.getScriptProperties();
  chiaveOStop();
  const io = (Session.getEffectiveUser().getEmail() || '').toLowerCase();
  const limite = new Date(Date.now() - 3 * 86400000);
  const visti = JSON.parse(props.getProperty('VISTI_INVIATI') || '[]');
  const giaVisti = new Set(visti);
  const nuovi = [];
  GmailApp.search(ricerca, 0, 100).forEach(function (thread) {
    thread.getMessages().forEach(function (m) {
      const id = m.getId();
      if (giaVisti.has(id) || m.isDraft() || m.getDate() < limite) return;
      if (io && m.getFrom().toLowerCase().indexOf(io) === -1) return; // solo i messaggi spediti da noi
      nuovi.push({
        id: id,
        a: indirizziIn(m.getTo() + ',' + m.getCc()),
        oggetto: m.getSubject(),
        data: m.getDate().toISOString(),
      });
    });
  });
  if (!nuovi.length) return;
  for (let i = 0; i < nuovi.length; i += 50) {
    const lotto = nuovi.slice(i, i + 50);
    chiamaCrm('inviati', { messaggi: lotto });
    lotto.forEach(function (m) { visti.push(m.id); });
  }
  // Una proprietà di Apps Script tiene al massimo 9 KB: 400 id bastano per tre giorni di invii.
  props.setProperty('VISTI_INVIATI', JSON.stringify(visti.slice(-400)));
}

// ---------- report DMARC ----------

/** Un report DMARC (XML) diventa un riassunto compatto: chi ha spedito a nome del dominio e se SPF/DKIM hanno passato. */
function leggiDmarc(xml) {
  const radice = XmlService.parse(xml).getRootElement();
  const ns = radice.getNamespace();
  const figlio = function (el, nome) { return el ? el.getChild(nome, ns) : null; };
  const testoDi = function (el, nome) { const f = figlio(el, nome); return f ? f.getText() : ''; };
  const meta = figlio(radice, 'report_metadata');
  const intervallo = figlio(meta, 'date_range');
  const politica = figlio(radice, 'policy_published');
  const aggregato = {};
  radice.getChildren('record', ns).forEach(function (rec) {
    const riga = figlio(rec, 'row');
    const ev = figlio(riga, 'policy_evaluated');
    const ident = figlio(rec, 'identifiers');
    const chiave = [testoDi(riga, 'source_ip'), testoDi(ev, 'disposition'), testoDi(ev, 'dkim'), testoDi(ev, 'spf'), testoDi(ident, 'header_from')].join('|');
    aggregato[chiave] = aggregato[chiave] || {
      ip: testoDi(riga, 'source_ip'), n: 0, disposizione: testoDi(ev, 'disposition'),
      dkim: testoDi(ev, 'dkim'), spf: testoDi(ev, 'spf'), da: testoDi(ident, 'header_from'),
    };
    aggregato[chiave].n += Number(testoDi(riga, 'count')) || 0;
  });
  const giorno = function (s) { return s ? Utilities.formatDate(new Date(Number(s) * 1000), 'Europe/Rome', 'yyyy-MM-dd') : null; };
  return {
    org: testoDi(meta, 'org_name'),
    da: giorno(testoDi(intervallo, 'begin')),
    a: giorno(testoDi(intervallo, 'end')),
    politica: testoDi(politica, 'p'),
    righe: Object.keys(aggregato).map(function (k) { return aggregato[k]; }),
  };
}

/** Ogni mattina: legge i report DMARC arrivati negli ultimi giorni e ne manda il riassunto al CRM. */
function controllaDmarc() {
  const props = PropertiesService.getScriptProperties();
  chiaveOStop();
  const visti = JSON.parse(props.getProperty('DMARC_VISTI') || '[]');
  const giaVisti = new Set(visti);
  const rapporti = [];
  const nuoviId = [];
  GmailApp.search('subject:"Report Domain" OR subject:"Report domain" has:attachment newer_than:14d', 0, 40).forEach(function (thread) {
    thread.getMessages().forEach(function (m) {
      const id = m.getId();
      if (giaVisti.has(id)) return;
      nuoviId.push(id);
      m.getAttachments().forEach(function (a) {
        try {
          const nome = a.getName().toLowerCase();
          let xml = null;
          if (nome.indexOf('.gz') !== -1) xml = Utilities.ungzip(a.copyBlob().setContentType('application/x-gzip')).getDataAsString();
          else if (nome.indexOf('.zip') !== -1) xml = Utilities.unzip(a.copyBlob().setContentType('application/zip'))[0].getDataAsString();
          else if (nome.indexOf('.xml') !== -1) xml = a.getDataAsString();
          if (!xml) return;
          const r = leggiDmarc(xml);
          r.id = id + ':' + a.getName();
          rapporti.push(r);
        } catch (e) { /* un allegato illeggibile non blocca gli altri */ }
      });
    });
  });
  if (rapporti.length) chiamaCrm('dmarc', { rapporti: rapporti });
  nuoviId.forEach(function (id) { visti.push(id); });
  props.setProperty('DMARC_VISTI', JSON.stringify(visti.slice(-300)));
}

// ---------- backup ----------

/** Un esportino dei dati del CRM su Drive, una volta a settimana. Non è un secondo posto dove *lavorare* i
 *  dati: serve solo come rete di sicurezza se succede qualcosa al database. */
function backupSettimanale() {
  const chiave = chiaveOStop();
  const r = UrlFetchApp.fetch(INDIRIZZO_CRM, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-postino-chiave': chiave },
    payload: JSON.stringify({ azione: 'backup' }),
    muteHttpExceptions: true,
  });
  if (r.getResponseCode() !== 200) throw new Error('CRM ha risposto ' + r.getResponseCode() + ': ' + r.getContentText());

  const cartelle = DriveApp.getFoldersByName(CARTELLA_BACKUP);
  const cartella = cartelle.hasNext() ? cartelle.next() : DriveApp.createFolder(CARTELLA_BACKUP);

  const oggi = Utilities.formatDate(new Date(), 'Europe/Rome', 'yyyy-MM-dd');
  cartella.createFile(Utilities.newBlob(r.getContentText(), 'application/json', 'backup-crm-' + oggi + '.json'));

  // Pulizia: tiene solo le backup delle ultime SETTIMANE_DA_TENERE settimane.
  const limite = new Date();
  limite.setDate(limite.getDate() - SETTIMANE_DA_TENERE * 7);
  const file = cartella.getFiles();
  while (file.hasNext()) {
    const f = file.next();
    if (f.getName().indexOf('backup-crm-') === 0 && f.getDateCreated() < limite) f.setTrashed(true);
  }
}
`,j=100;async function M(e,t,n){for(let r=0;r<e.length;r+=j)await t(e.slice(r,r+j)),n(Math.min(r+j,e.length))}async function N(e,t,n){await M(t,async t=>{let{error:n}=await p.from(e).upsert(t,{onConflict:`id`,ignoreDuplicates:!0});if(n)throw Error(`${e}: ${n.message}`)},n)}var P=e=>(e??``).trim().toLowerCase(),F=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function I(e){let t=await m(),n=new Set(t.map(e=>P(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(F)),i=[];for(let t of e){let e=P(t.email);(e?n.has(e):r.has(F(t)))||(e?n.add(e):r.add(F(t)),i.push({...t,email:e||null}))}return{nuovi:i,saltati:e.length-i.length}}async function L(e,t){let{nuovi:n,saltati:r}=await I(e);return await M(n,async e=>{let{error:t}=await p.from(`contatti`).insert(e);if(t)throw Error(`contatti: ${t.message}`)},e=>t(`Contatti: ${e} di ${n.length}`)),{inseriti:n.length,saltati:r}}async function R(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await N(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await N(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await N(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await L(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function z(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var B={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function V(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>B[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var H=f();function U(){let{email:e,nome:t}=u(),[n,r]=(0,k.useState)([]),[a,o]=(0,k.useState)(null),s=window.matchMedia(`(display-mode: standalone)`).matches;return(0,k.useEffect)(()=>{i().then(r).catch(()=>{});let e=e=>{e.preventDefault(),o(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(`div`,{className:`testata`,children:(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,H.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,H.jsxs)(`div`,{className:`griglia-campi`,children:[(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Il tuo accesso`}),(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,H.jsx)(`strong`,{children:e}),`.`]}),(0,H.jsx)(`p`,{className:`piccolo`,style:{marginTop:4},children:`Resti collegato su questo dispositivo finché non esci.`}),(0,H.jsxs)(`button`,{className:`btn btn-piccolo`,style:{marginTop:12},onClick:()=>_(),children:[(0,H.jsx)(b,{size:15}),` Esci`]})]}),(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`L’app sul telefono`}),s?(0,H.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{className:`aiuto`,children:[(0,H.jsx)(w,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,H.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,H.jsxs)(`li`,{children:[(0,H.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,H.jsxs)(`li`,{children:[(0,H.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),a&&(0,H.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>a.prompt(),children:`Installa su questo dispositivo`})]})]}),(0,H.jsx)(v,{}),(0,H.jsx)(q,{}),(0,H.jsx)(Y,{}),(0,H.jsx)(J,{}),(0,H.jsx)(W,{}),(0,H.jsx)(G,{}),(0,H.jsx)(K,{}),(0,H.jsxs)(`section`,{className:`blocco`,children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Chi può entrare`}),(0,H.jsx)(`div`,{className:`lista`,children:n.map(e=>(0,H.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,H.jsx)(O,{size:16,style:{color:`var(--brass)`}}),(0,H.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,H.jsx)(`p`,{className:`piccolo`,style:{marginTop:10},children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,H.jsx)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`})]})]})}function W(){let{condizioni:t,mettiCondizioni:n}=u(),[r,i]=(0,k.useState)(t),[a,s]=(0,k.useState)(!1),[c,d]=(0,k.useState)(null),f=o.some(({chiave:e})=>r[e]!==t[e]);(0,k.useEffect)(()=>i(t),[t]);async function p(t){t.preventDefault();let i=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,t.trim()]));s(!0),d(null);try{await e(i),n(i),l(`Salvato: i prossimi messaggi usano questi dati`)}catch{d(`Non riesco a salvarli, riprova.`)}finally{s(!1)}}return(0,H.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:p,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,H.jsx)(`div`,{className:`griglia-campi due`,children:o.map(({chiave:e,etichetta:t,esempio:n})=>(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:t}),(0,H.jsx)(`input`,{className:`input`,value:r[e],placeholder:n,onChange:t=>i({...r,[e]:t.target.value})})]},e))}),(0,H.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!f,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,H.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),c&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:c})]})}function G(){let{ricarica:e}=u(),[t,n]=(0,k.useState)(null),[r,i]=(0,k.useState)(``),[a,o]=(0,k.useState)(null),[s,c]=(0,k.useState)(null),[d,f]=(0,k.useState)(null),[p,m]=(0,k.useState)(!1);async function h(e){let t=e.target.files?.[0];if(e.target.value=``,t){f(null),c(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),i(t.name)}catch{n(null),f(`Questo file non è un pacchetto di import valido.`)}}}async function g(){if(t){m(!0),f(null);try{let r=await R(t,o);c(r),n(null),await e(),l(`Import completato`)}catch(e){f(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{m(!1),o(null)}}}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,H.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,H.jsx)(E,{size:15}),` Scegli il file .json`,(0,H.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:h,hidden:!0})]}),t&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,H.jsx)(`button`,{className:`btn btn-primario`,onClick:g,disabled:p,children:p?`Importo…`:`Importa adesso`})]}),a&&(0,H.jsx)(`p`,{className:`piccolo`,role:`status`,children:a}),s&&(0,H.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,s.leads,` lead, `,s.interazioni,` interazioni, `,s.bozze,` messaggi, `,s.contatti,` contatti nuovi`,s.contattiSaltati?` (${s.contattiSaltati} erano già in rubrica)`:``,`.`]}),d&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:d})]})}function K(){let{ricarica:e}=u(),[t,n]=(0,k.useState)(null),[r,i]=(0,k.useState)(``),[a,o]=(0,k.useState)(`hotel`),[c,d]=(0,k.useState)(``),[f,p]=(0,k.useState)(null),[m,h]=(0,k.useState)(null),[g,_]=(0,k.useState)(!1),v=()=>t?V(t,a,c.trim()||null).contatti:[];(0,k.useEffect)(()=>{if(!t)return;let{contatti:e,colonne:n}=V(t,a,c.trim()||null);I(e).then(({nuovi:t})=>p({totale:e.length,nuovi:t.length,colonne:n})).catch(()=>p({totale:e.length,nuovi:e.length,colonne:n}))},[t,a,c]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;h(null);let r=z(await t.text());if(r.length<2){h(`Il file sembra vuoto.`);return}n(r),i(t.name)}async function b(){_(!0);try{let t=await L(v(),()=>{});l(`${t.inseriti} contatti aggiunti${t.saltati?`, ${t.saltati} già presenti`:``}`),n(null),p(null),await e()}catch(e){h(e instanceof Error?e.message:`Import non riuscito.`)}finally{_(!1)}}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,H.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,H.jsx)(E,{size:15}),` Scegli il file .csv`,(0,H.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),t&&f&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,H.jsx)(`strong`,{children:r}),`: `,f.totale,` righe, di cui `,(0,H.jsxs)(`strong`,{children:[f.nuovi,` nuove`]}),`. Colonne riconosciute: `,f.colonne.join(`, `)||`nessuna`,`.`]}),(0,H.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:`Categoria`}),(0,H.jsx)(`select`,{className:`input`,value:a,onChange:e=>o(e.target.value),children:s.map(e=>(0,H.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,H.jsxs)(`label`,{className:`campo`,children:[(0,H.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,H.jsx)(`input`,{className:`input`,value:c,onChange:e=>d(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,H.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:g||!f.nuovi,children:g?`Aggiungo…`:`Aggiungi ${f.nuovi} contatti`})]}),m&&(0,H.jsx)(`div`,{className:`errore-box`,role:`alert`,children:m})]})}function q(){let{coda:e,mettiCoda:t}=u(),[n,i]=(0,k.useState)(String(e.quanti)),[a,o]=(0,k.useState)(e.verticali),[s,c]=(0,k.useState)(String(e.tetto)),[d,f]=(0,k.useState)(!1),p=Number(n)!==e.quanti||Number(s)!==e.tetto||a.join()!==e.verticali.join(),m=e=>o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function g(){let e=Math.min(40,Math.max(1,Math.trunc(Number(n))||10));f(!0);try{let n=Math.min(100,Math.max(5,Math.trunc(Number(s))||30)),o={quanti:e,verticali:a,tetto:n};await r(o),t(o),i(String(e)),c(String(n)),l(`Coda aggiornata`)}catch{l(`Non riesco a salvare, riprova`)}f(!1)}return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,H.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,H.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,H.jsx)(`span`,{children:`Bozze al giorno`}),(0,H.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:n,onChange:e=>i(e.target.value)})]}),(0,H.jsxs)(`label`,{className:`campo`,style:{maxWidth:320},children:[(0,H.jsx)(`span`,{children:`Massimo di email inviate al giorno`}),(0,H.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:5,max:100,value:s,onChange:e=>c(e.target.value)}),(0,H.jsx)(`span`,{className:`piccolo`,children:`Primi contatti e follow-up insieme. Con un Gmail giovane, oltre 30 al giorno con testi simili si rischia lo spam.`})]}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,H.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(h).map(([e,t])=>{let n=a.indexOf(e);return(0,H.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>m(e),"aria-pressed":n>=0,children:[n>=0&&(0,H.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,H.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:g,disabled:!p||d,children:d?`Salvo…`:`Salva`})]})}function J(){let[e,t]=(0,k.useState)(void 0);(0,k.useEffect)(()=>{a().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),i=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),o=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),s=r?Math.round(i/r*100):0,c=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,H.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,H.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,H.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,H.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,H.jsx)(S,{size:22,style:{color:s>=95?`var(--ok)`:`var(--warn)`}}),(0,H.jsxs)(`span`,{style:{fontSize:15},children:[(0,H.jsxs)(`strong`,{children:[s,`%`]}),` dei `,r,` messaggi `,c?`dal ${c} `:``,`ha superato i controlli.`]})]}),o.length>0&&(0,H.jsx)(`div`,{className:`nota-box`,children:(0,H.jsxs)(`span`,{children:[o.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,o.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function Y(){let[e,t]=(0,k.useState)(void 0);return(0,k.useEffect)(()=>{c(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0))},[]),(0,H.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,H.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,H.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,H.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,H.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,e===void 0?`non lo so ancora`:e?(0,H.jsx)(`strong`,{style:{color:`var(--ok)`},children:`aggiornato e attivo ✓`}):(0,H.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,H.jsxs)(`details`,{children:[(0,H.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,H.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,H.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,H.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,H.jsxs)(`li`,{children:[`Apri `,(0,H.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,H.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,H.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,H.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,H.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,H.jsx)(`strong`,{children:`installa`}),` e premi `,(0,H.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,H.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>d(A,`Codice copiato: incollalo nello script`),children:[(0,H.jsx)(g,{size:15}),` Copia il codice`]})]})}export{U as Impostazioni};
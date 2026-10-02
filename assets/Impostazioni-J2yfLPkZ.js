import{$ as e,A as t,R as n,St as r,Z as i,d as a,h as o,j as s,n as c,o as l,p as u,pt as d,r as f,s as p,tt as m,xt as h}from"./avvisi-Edm9yEL9.js";import{t as g}from"./copy-UMMh4p_0.js";import{y as _}from"./index-D63TvD_y.js";var v={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};v.node;var y=h(v),b={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};b.node;var x=h(b),S={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};S.node;var C=h(S),w={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};w.node;var T=h(w),E={name:`users`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};E.node;var D=h(E),O=r(),k=`/**
 * Postino del CRM — Teatro Nazionale Firenze
 *
 * Vive nel Gmail teatronazionalefirenze@gmail.com (quello che importa info@ via POP3). Fa questi lavori, tutti senza
 * Claude (continua a funzionare anche quando i crediti finiscono):
 *
 * 1. Ogni 10 minuti manda al CRM i messaggi arrivati negli ultimi 2 giorni che non ha ancora mandato.
 *    Il CRM tiene SOLO le risposte dei lead e i rimbalzi; tutto il resto lo ignora e non lo salva.
 *
 * 2. Ogni minuto controlla se nel CRM c'è una bozza «da mettere in Gmail» e la crea tra le BOZZE di Gmail, pronta da
 *    inviare anche dal telefono. NON la invia mai.
 *
 * 3. Ogni 10 minuti guarda i messaggi che hai INVIATO dal Gmail del teatro: se sono diretti a un lead, il CRM lo segna
 *    «contattato» e fissa il follow-up, senza che tu debba toccare «Segna inviato».
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
  ScriptApp.newTrigger('controllaPosta').timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger('elaboraBozze').timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger('controllaInviati').timeBased().everyMinutes(10).create();
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

/** Ogni minuto: le bozze «in coda» nel CRM diventano vere bozze di Gmail. Mai inviate. */
function elaboraBozze() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // un altro giro è ancora in corso
  try {
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
  } finally {
    lock.releaseLock();
  }
}

// ---------- messaggi inviati ----------

function indirizziIn(testo) {
  return (String(testo || '').match(/[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+/g) || []).map(function (e) { return e.toLowerCase(); });
}

/** Ogni 10 minuti: i messaggi inviati dal Gmail del teatro verso i lead diventano «contatto fatto» nel CRM. */
function controllaInviati() {
  const props = PropertiesService.getScriptProperties();
  chiaveOStop();
  const io = (Session.getEffectiveUser().getEmail() || '').toLowerCase();
  const limite = new Date(Date.now() - 3 * 86400000);
  const visti = JSON.parse(props.getProperty('VISTI_INVIATI') || '[]');
  const giaVisti = new Set(visti);
  const nuovi = [];
  GmailApp.search('in:sent newer_than:3d', 0, 100).forEach(function (thread) {
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
  for (let i = 0; i < nuovi.length; i += 50) {
    const lotto = nuovi.slice(i, i + 50);
    chiamaCrm('inviati', { messaggi: lotto });
    lotto.forEach(function (m) { visti.push(m.id); });
  }
  props.setProperty('VISTI_INVIATI', JSON.stringify(visti.slice(-600)));
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
`,A=100;async function j(e,t,n){for(let r=0;r<e.length;r+=A)await t(e.slice(r,r+A)),n(Math.min(r+A,e.length))}async function M(t,n,r){await j(n,async n=>{let{error:r}=await e.from(t).upsert(n,{onConflict:`id`,ignoreDuplicates:!0});if(r)throw Error(`${t}: ${r.message}`)},r)}var N=e=>(e??``).trim().toLowerCase(),P=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function F(e){let t=await u(),n=new Set(t.map(e=>N(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(P)),i=[];for(let t of e){let e=N(t.email);(e?n.has(e):r.has(P(t)))||(e?n.add(e):r.add(P(t)),i.push({...t,email:e||null}))}return{nuovi:i,saltati:e.length-i.length}}async function I(t,n){let{nuovi:r,saltati:i}=await F(t);return await j(r,async t=>{let{error:n}=await e.from(`contatti`).insert(t);if(n)throw Error(`contatti: ${n.message}`)},e=>n(`Contatti: ${e} di ${r.length}`)),{inseriti:r.length,saltati:i}}async function L(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await M(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await M(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await M(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await I(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function R(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var z={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function B(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>z[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var V=p();function H(){let{email:e,nome:t}=l(),[r,i]=(0,O.useState)([]),[a,o]=(0,O.useState)(null),s=window.matchMedia(`(display-mode: standalone)`).matches;return(0,O.useEffect)(()=>{n().then(i).catch(()=>{});let e=e=>{e.preventDefault(),o(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`div`,{className:`testata`,children:(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,V.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,V.jsxs)(`div`,{className:`griglia-campi`,children:[(0,V.jsxs)(`section`,{className:`blocco`,children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`Il tuo accesso`}),(0,V.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,V.jsx)(`strong`,{children:e}),`.`]}),(0,V.jsx)(`p`,{className:`piccolo`,style:{marginTop:4},children:`Resti collegato su questo dispositivo finché non esci.`}),(0,V.jsxs)(`button`,{className:`btn btn-piccolo`,style:{marginTop:12},onClick:()=>_(),children:[(0,V.jsx)(y,{size:15}),` Esci`]})]}),(0,V.jsxs)(`section`,{className:`blocco`,children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`L’app sul telefono`}),s?(0,V.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`p`,{className:`aiuto`,children:[(0,V.jsx)(C,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,V.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),a&&(0,V.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>a.prompt(),children:`Installa su questo dispositivo`})]})]}),(0,V.jsx)(K,{}),(0,V.jsx)(J,{}),(0,V.jsx)(q,{}),(0,V.jsx)(U,{}),(0,V.jsx)(W,{}),(0,V.jsx)(G,{}),(0,V.jsxs)(`section`,{className:`blocco`,children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`Chi può entrare`}),(0,V.jsx)(`div`,{className:`lista`,children:r.map(e=>(0,V.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,V.jsx)(D,{size:16,style:{color:`var(--brass)`}}),(0,V.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,V.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,V.jsx)(`p`,{className:`piccolo`,style:{marginTop:10},children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,V.jsx)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`})]})]})}function U(){let{condizioni:e,mettiCondizioni:t}=l(),[n,r]=(0,O.useState)(e),[a,o]=(0,O.useState)(!1),[u,d]=(0,O.useState)(null),f=i.some(({chiave:t})=>n[t]!==e[t]);(0,O.useEffect)(()=>r(e),[e]);async function p(e){e.preventDefault();let r=Object.fromEntries(Object.entries(n).map(([e,t])=>[e,t.trim()]));o(!0),d(null);try{await s(r),t(r),c(`Salvato: i prossimi messaggi usano questi dati`)}catch{d(`Non riesco a salvarli, riprova.`)}finally{o(!1)}}return(0,V.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:p,children:[(0,V.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,V.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,V.jsx)(`div`,{className:`griglia-campi due`,children:i.map(({chiave:e,etichetta:t,esempio:i})=>(0,V.jsxs)(`label`,{className:`campo`,children:[(0,V.jsx)(`span`,{children:t}),(0,V.jsx)(`input`,{className:`input`,value:n[e],placeholder:i,onChange:t=>r({...n,[e]:t.target.value})})]},e))}),(0,V.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!f,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,V.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),u&&(0,V.jsx)(`div`,{className:`errore-box`,role:`alert`,children:u})]})}function W(){let{ricarica:e}=l(),[t,n]=(0,O.useState)(null),[r,i]=(0,O.useState)(``),[a,o]=(0,O.useState)(null),[s,u]=(0,O.useState)(null),[d,f]=(0,O.useState)(null),[p,m]=(0,O.useState)(!1);async function h(e){let t=e.target.files?.[0];if(e.target.value=``,t){f(null),u(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),i(t.name)}catch{n(null),f(`Questo file non è un pacchetto di import valido.`)}}}async function g(){if(t){m(!0),f(null);try{let r=await L(t,o);u(r),n(null),await e(),c(`Import completato`)}catch(e){f(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{m(!1),o(null)}}}return(0,V.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,V.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,V.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,V.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,V.jsx)(T,{size:15}),` Scegli il file .json`,(0,V.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:h,hidden:!0})]}),t&&(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,V.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,V.jsx)(`button`,{className:`btn btn-primario`,onClick:g,disabled:p,children:p?`Importo…`:`Importa adesso`})]}),a&&(0,V.jsx)(`p`,{className:`piccolo`,role:`status`,children:a}),s&&(0,V.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,s.leads,` lead, `,s.interazioni,` interazioni, `,s.bozze,` messaggi, `,s.contatti,` contatti nuovi`,s.contattiSaltati?` (${s.contattiSaltati} erano già in rubrica)`:``,`.`]}),d&&(0,V.jsx)(`div`,{className:`errore-box`,role:`alert`,children:d})]})}function G(){let{ricarica:e}=l(),[t,n]=(0,O.useState)(null),[r,i]=(0,O.useState)(``),[a,o]=(0,O.useState)(`hotel`),[s,u]=(0,O.useState)(``),[d,f]=(0,O.useState)(null),[p,h]=(0,O.useState)(null),[g,_]=(0,O.useState)(!1),v=()=>t?B(t,a,s.trim()||null).contatti:[];(0,O.useEffect)(()=>{if(!t)return;let{contatti:e,colonne:n}=B(t,a,s.trim()||null);F(e).then(({nuovi:t})=>f({totale:e.length,nuovi:t.length,colonne:n})).catch(()=>f({totale:e.length,nuovi:e.length,colonne:n}))},[t,a,s]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;h(null);let r=R(await t.text());if(r.length<2){h(`Il file sembra vuoto.`);return}n(r),i(t.name)}async function b(){_(!0);try{let t=await I(v(),()=>{});c(`${t.inseriti} contatti aggiunti${t.saltati?`, ${t.saltati} già presenti`:``}`),n(null),f(null),await e()}catch(e){h(e instanceof Error?e.message:`Import non riuscito.`)}finally{_(!1)}}return(0,V.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,V.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,V.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,V.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,V.jsx)(T,{size:15}),` Scegli il file .csv`,(0,V.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),t&&d&&(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,V.jsx)(`strong`,{children:r}),`: `,d.totale,` righe, di cui `,(0,V.jsxs)(`strong`,{children:[d.nuovi,` nuove`]}),`. Colonne riconosciute: `,d.colonne.join(`, `)||`nessuna`,`.`]}),(0,V.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,V.jsxs)(`label`,{className:`campo`,children:[(0,V.jsx)(`span`,{children:`Categoria`}),(0,V.jsx)(`select`,{className:`input`,value:a,onChange:e=>o(e.target.value),children:m.map(e=>(0,V.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,V.jsxs)(`label`,{className:`campo`,children:[(0,V.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,V.jsx)(`input`,{className:`input`,value:s,onChange:e=>u(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,V.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:g||!d.nuovi,children:g?`Aggiungo…`:`Aggiungi ${d.nuovi} contatti`})]}),p&&(0,V.jsx)(`div`,{className:`errore-box`,role:`alert`,children:p})]})}function K(){let{coda:e,mettiCoda:n}=l(),[r,i]=(0,O.useState)(String(e.quanti)),[a,o]=(0,O.useState)(e.verticali),[s,u]=(0,O.useState)(!1),f=Number(r)!==e.quanti||a.join()!==e.verticali.join(),p=e=>o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function m(){let e=Math.min(40,Math.max(1,Math.trunc(Number(r))||10));u(!0);try{let r={quanti:e,verticali:a};await t(r),n(r),i(String(e)),c(`Coda aggiornata`)}catch{c(`Non riesco a salvare, riprova`)}u(!1)}return(0,V.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,V.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,V.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,V.jsx)(`span`,{children:`Bozze al giorno`}),(0,V.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:r,onChange:e=>i(e.target.value)})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,V.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(d).map(([e,t])=>{let n=a.indexOf(e);return(0,V.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>p(e),"aria-pressed":n>=0,children:[n>=0&&(0,V.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,V.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:m,disabled:!f||s,children:s?`Salvo…`:`Salva`})]})}function q(){let[e,t]=(0,O.useState)(void 0);(0,O.useEffect)(()=>{o().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),i=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),a=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),s=r?Math.round(i/r*100):0,c=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,V.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,V.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,V.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,V.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,V.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,V.jsx)(x,{size:22,style:{color:s>=95?`var(--ok)`:`var(--warn)`}}),(0,V.jsxs)(`span`,{style:{fontSize:15},children:[(0,V.jsxs)(`strong`,{children:[s,`%`]}),` dei `,r,` messaggi `,c?`dal ${c} `:``,`ha superato i controlli.`]})]}),a.length>0&&(0,V.jsx)(`div`,{className:`nota-box`,children:(0,V.jsxs)(`span`,{children:[a.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,a.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function J(){let[e,t]=(0,O.useState)(void 0);return(0,O.useEffect)(()=>{a(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0))},[]),(0,V.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,V.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,V.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,V.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,V.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,e===void 0?`non lo so ancora`:e?(0,V.jsx)(`strong`,{style:{color:`var(--ok)`},children:`aggiornato e attivo ✓`}):(0,V.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,V.jsxs)(`details`,{children:[(0,V.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,V.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,V.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,V.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,V.jsxs)(`li`,{children:[`Apri `,(0,V.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,V.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,V.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,V.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,V.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,V.jsx)(`strong`,{children:`installa`}),` e premi `,(0,V.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,V.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>f(k,`Codice copiato: incollalo nello script`),children:[(0,V.jsx)(g,{size:15}),` Copia il codice`]})]})}export{H as Impostazioni};
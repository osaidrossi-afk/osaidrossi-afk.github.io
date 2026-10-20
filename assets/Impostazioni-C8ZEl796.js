import{At as e,Bn as t,F as n,Ft as r,K as i,R as a,Tn as o,Vn as s,Yt as c,b as l,dn as u,g as d,h as f,ht as p,kt as m,ln as h,n as g,pn as _,y as v}from"./ui-CPUUtjam.js";import{t as y}from"./copy-BfPV2Cnx.js";import{o as b}from"./rotta-BJ08iqFY.js";import{E as x,T as S,o as C,q as w}from"./index-DmSIulmN.js";var T={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};T.node;var E=t(T),D={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};D.node;var O=t(D),k={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};k.node;var A=t(k),j={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};j.node;var M=t(j),N=s(),P=`/**
 * Postino del CRM — Teatro Nazionale Firenze
 *
 * Vive nel Gmail teatronazionalefirenze@gmail.com (quello che importa info@ via POP3). Fa questi lavori, tutti senza
 * Claude (continua a funzionare anche quando i crediti finiscono):
 *
 * 1. Ogni 5 minuti manda al CRM i messaggi arrivati dall'ultimo controllo (con 4 ore di margine per i ritardi del POP).
 *    Il CRM tiene SOLO le risposte dei lead e i rimbalzi; tutto il resto lo ignora e non lo salva.
 *
 * 2. Ogni minuto controlla se nel CRM c'è una bozza «da mettere in Gmail» e la crea tra le BOZZE di Gmail, pronta da
 *    inviare anche dal telefono. NON la invia mai.
 *
 * 3. Ogni minuto (dalle 7 alle 23) guarda i messaggi che hai appena INVIATO dal Gmail del teatro: se sono diretti a un
 *    lead, il CRM lo segna «contattato» e fissa il follow-up, e l'app te lo conferma subito. Ogni 15 minuti ripassa tutto
 *    quello inviato dall'ultimo ripasso, per non perdere niente (anche quello che invii di notte).
 *
 * 4. Ogni mattina legge i report DMARC arrivati (allegati compressi che il CRM da solo non apre) e manda al CRM un
 *    riassunto: dice se le email spedite con l'indirizzo del dominio superano i controlli di sicurezza.
 *
 * 5. Ogni 15 minuti rilegge in Gmail, pochi lead alla volta, la conversazione con ciascuno (ultimi 6 mesi): i messaggi che
 *    il CRM non ha ancora (arrivati prima del Postino, archiviati, scritti da un collega con il teatro in copia) entrano
 *    nella scheda del lead e nella sua storia. Così «Prepara messaggio» parte sempre dalla conversazione vera.
 *
 * 6. Ogni 15 minuti legge le conversazioni che il team (Matteo) porta avanti con clienti e agenzie mettendo info@ in copia:
 *    il CRM ne tiene un riassunto (con chi, su cosa, chi deve rispondere) nella sezione «Trattative», e se il cliente è un
 *    lead le aggiunge alla sua storia. Così non serve chiedere a Matteo cosa ha risposto.
 *
 * 7. Ogni lunedì mattina scarica un esportino di tutti i dati del CRM (lead, contatti, storico) e lo salva su Google
 *    Drive, cartella «CRM Teatro — Backup». Tiene solo le ultime 10 settimane, le più vecchie le cancella da sole.
 *
 * 8. Ogni 15 minuti sposta rimbalzi, avvisi di mancata consegna e report DMARC già letti dal CRM fuori dalla posta in
 *    arrivo, sotto l'etichetta «Sistema (rimbalzi e DMARC)»: non confondono più chi legge la posta.
 *
 * Google limita le operazioni sulla posta di un Gmail personale (circa 20.000 al giorno): ogni giro legge solo il tempo
 * passato dall'ultimo e tutte le conversazioni in una volta sola. Vedi «quota giornaliera di Gmail» più sotto.
 *
 * 10. Manda anche alla funzione «richieste» la stessa posta in arrivo e gli invii: lì restano solo le richieste generiche di
 *     chi non è un lead (clienti, scuole, informazioni, proposte), che nell'app hanno la loro sezione con la risposta pronta.
 *     La prima volta recupera le ultime due settimane.
 *
 * 9. A ogni giro cancella da Gmail le bozze che il CRM ha tolto: quelle sostituite da una risposta riscritta da Claude e
 *    quelle tolte dall'app con «Non inviato, toglilo». Così in Gmail resta solo quella giusta e la vecchia non parte per sbaglio.
 *
 * Questo script NON invia email e NON cancella posta: legge, crea bozze, cancella solo le bozze che il CRM ha tolto e
 * archivia la sola posta di sistema. Su Drive scrive solo dentro la
 * sua cartella di backup, non tocca nient'altro.
 *
 * La chiave la crea lo script stesso al primo avvio (proprietà CHIAVE_POSTINO) e la registra una volta sul
 * CRM: nessuno deve copiarla o incollarla. Il CRM accetta la registrazione solo se è stata aperta a mano.
 *
 * Installazione / aggiornamento: incolla il codice ed esegui «installa» una volta (Google chiede l'autorizzazione:
 * accetta tutto, serve per leggere la posta e creare bozze).
 */
const INDIRIZZO_CRM = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/agente-ricerca';
const INDIRIZZO_NOTIFICA = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/notifica';
const INDIRIZZO_RICHIESTE = 'https://fcarfyibyhmgpvxdwxvl.supabase.co/functions/v1/richieste';
const CARTELLA_BACKUP = 'CRM Teatro — Backup';
const SETTIMANE_DA_TENERE = 10;
// Le bozze partono dall'indirizzo del teatro (alias «Invia come» del Gmail, via SMTP Aruba), non dal Gmail: così il
// destinatario vede il dominio vero e le risposte arrivano in info@ (visibili anche in Outlook). Se l'alias non c'è,
// la bozza nasce dal Gmail come prima.
const MITTENTE = 'info@teatronazionalefirenze.it';
// Cambia a ogni modifica del Postino: l'app la confronta con la sua copia e, se questa è vecchia, chiede di rincollarlo.
const VERSIONE = '2026-10-20';
const NOME_MITTENTE = 'Osaid El Debuch – Teatro Nazionale Firenze';

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
/** Le richieste generiche: se la funzione non risponde il resto del Postino va avanti lo stesso (si recupera al giro dopo). */
function chiamaRichieste(azione, resto) {
  try {
    const r = UrlFetchApp.fetch(INDIRIZZO_RICHIESTE, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-postino-chiave': chiaveOStop() },
      payload: JSON.stringify(Object.assign({ azione: azione }, resto || {})),
      muteHttpExceptions: true,
    });
    return r.getResponseCode() === 200;
  } catch (e) {
    return false;
  }
}

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

// ---------- quota giornaliera di Gmail ----------
// Google concede a un Gmail personale un numero limitato di operazioni sulla posta al giorno (circa 20.000). Il 12/10/2026
// il Postino le ha finite alle 9:37: a ogni giro rileggeva una per una tutte le conversazioni degli ultimi giorni (in arrivo
// ogni 5 minuti, inviati ogni minuto e ogni 15), e da lì in poi né bozze né conferme fino al giorno dopo. Ora ogni ricerca
// guarda solo il tempo passato dall'ultimo giro riuscito (più un margine) e le conversazioni trovate si leggono tutte in una
// volta sola (GmailApp.getMessagesForThreads), non una per una. Se la quota finisce lo stesso, il Postino si ferma mezz'ora
// invece di ritentare ogni minuto, e le bozze rimaste a metà tornano in coda da sole (il CRM le riconsegna dopo 10 minuti).

const PAUSA_QUOTA_MIN = 30;

function quotaFinita(e) {
  return /too many times|troppe volte/i.test(String(e));
}

function inPausa() {
  return Date.now() < Number(PropertiesService.getScriptProperties().getProperty('PAUSA_FINO') || 0);
}

/** Esegue un lavoro del Postino, ma non durante la pausa per quota finita; se la quota finisce adesso, apre la pausa.
 *  Restituisce null se è andato bene, 'pausa' se non si è potuto fare, altrimenti l'errore. */
function giro(lavoro) {
  if (inPausa()) return 'pausa';
  try {
    lavoro();
    return null;
  } catch (e) {
    if (quotaFinita(e)) {
      PropertiesService.getScriptProperties().setProperty('PAUSA_FINO', String(Date.now() + PAUSA_QUOTA_MIN * 60000));
      return 'pausa';
    }
    return e;
  }
}

// Operazioni Gmail fatte in questo giro: si contano per sapere quanto manca al limite (il CRM le somma per giorno).
let OPERAZIONI = 0;
function conta(n) {
  OPERAZIONI += n || 1;
}

/** Fa i lavori di un controllo automatico e poi manda il segnale di vita, anche se qualcosa è andato storto: così l'app
 *  dice subito se il Postino è fermo (e perché), e se resta fermo più di 20 minuti arriva una notifica sul telefono. */
function esegui(nome, lavori) {
  OPERAZIONI = 0;
  let errore = null;
  let pausa = false;
  lavori.forEach(function (lavoro) {
    const r = giro(lavoro);
    if (r === 'pausa') pausa = true;
    else if (r && !errore) errore = r;
  });
  battito(nome, !errore && !pausa, errore);
  if (errore) throw errore;
}

function battito(nome, ok, errore) {
  try {
    const r = UrlFetchApp.fetch(INDIRIZZO_NOTIFICA, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-postino-chiave': chiaveOStop() },
      payload: JSON.stringify({
        azione: 'battito',
        lavoro: nome,
        ok: ok,
        errore: errore ? String(errore).slice(0, 300) : null,
        pausa_fino: Number(PropertiesService.getScriptProperties().getProperty('PAUSA_FINO') || 0),
        operazioni: OPERAZIONI,
        versione: VERSIONE,
      }),
      muteHttpExceptions: true,
    });
    // In risposta, le bozze di Gmail che il CRM ha tolto: si cancellano e si conferma.
    if (r.getResponseCode() !== 200) return;
    const daTogliere = JSON.parse(r.getContentText()).da_togliere || [];
    const tolte = togliBozze(daTogliere);
    if (!tolte.length) return;
    UrlFetchApp.fetch(INDIRIZZO_NOTIFICA, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-postino-chiave': chiaveOStop() },
      payload: JSON.stringify({ azione: 'bozze_tolte', tolte: tolte }),
      muteHttpExceptions: true,
    });
  } catch (e) { /* il segnale di vita non deve mai fermare il Postino */ }
}

/** Cancella da Gmail le bozze tolte dal CRM. Se una non c'è più (già inviata o cancellata a mano) va bene lo stesso. */
function togliBozze(elenco) {
  const tolte = [];
  elenco.forEach(function (t) {
    let esito = 'tolta';
    try { conta(2); GmailApp.getDraft(t.draft_id).deleteDraft(); } catch (e) {
      if (quotaFinita(e)) return;
      esito = 'non trovata (già inviata o cancellata)';
    }
    tolte.push({ id: t.id, esito: esito });
  });
  return tolte;
}

/** Ricerca in Gmail (conta come una operazione). */
function cerca(ricerca, da, quanti) {
  conta(1);
  return GmailApp.search(ricerca, da, quanti);
}

/** Da quando cercare: dall'ultimo giro riuscito meno un margine, mai più indietro di \`massimoGiorni\`. */
function finestra(chiave, margineMinuti, massimoGiorni) {
  const ultimo = Number(PropertiesService.getScriptProperties().getProperty(chiave) || 0);
  const minimo = Date.now() - massimoGiorni * 86400000;
  return Math.max(minimo, (ultimo || minimo) - margineMinuti * 60000);
}

/** Pezzo di ricerca Gmail «dopo questo momento» (Gmail vuole i secondi). */
function dopo(ms) {
  return ' after:' + Math.floor(ms / 1000);
}

/** Tutti i messaggi delle conversazioni trovate, letti in una volta sola (una operazione invece di una per conversazione). */
function messaggiDi(fili) {
  if (!fili.length) return [];
  conta(1);
  return GmailApp.getMessagesForThreads(fili);
}

/** Gli indirizzi «Invia come» del Gmail: cambiano di rado, si chiedono a Google al massimo ogni 6 ore. */
function alias() {
  const cache = CacheService.getScriptCache();
  const salvati = cache.get('ALIAS');
  if (salvati !== null) return JSON.parse(salvati);
  conta(1);
  const elenco = GmailApp.getAliases().map(function (x) { return x.toLowerCase(); });
  cache.put('ALIAS', JSON.stringify(elenco), 21600);
  return elenco;
}

// ---------- posta in arrivo ----------

function controllaPosta() {
  esegui('posta', [function () {
    const props = PropertiesService.getScriptProperties();
    chiaveOStop();
    const inizio = Date.now();

    // Ultimi messaggi già mandati: così ogni messaggio parte una volta sola.
    const visti = JSON.parse(props.getProperty('VISTI') || '[]');
    const giaVisti = new Set(visti);
    const nuovi = [];
    // Margine di 4 ore: la posta di info@ arriva qui via POP, a volte con ore di ritardo. Al primo giro (o dopo un fermo)
    // si guardano gli ultimi 2 giorni, come prima.
    const fili = cerca('in:inbox' + dopo(finestra('POSTA_DAL', 240, 2)), 0, 100);
    const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase(), MITTENTE].filter(function (x) { return x; });
    messaggiDi(fili).forEach(function (messaggi) {
      // Con chi abbiamo scritto in questa conversazione: se rispondono da un altro indirizzo (un collega, la segreteria,
      // un Gmail personale) il server riconosce comunque il lead.
      const filo = [];
      messaggi.forEach(function (m) {
        const da = m.getFrom().toLowerCase();
        if (!miei.some(function (x) { return da.indexOf(x) !== -1; })) return;
        indirizziIn(m.getTo() + ',' + m.getCc()).forEach(function (e) {
          if (miei.indexOf(e) === -1 && filo.indexOf(e) === -1 && filo.length < 10) filo.push(e);
        });
      });
      messaggi.forEach(function (m) {
        const id = m.getId();
        if (giaVisti.has(id) || m.isDraft()) return;
        nuovi.push({
          id: id,
          da: m.getFrom(),
          a: indirizziIn(m.getTo()),
          cc: indirizziIn(m.getCc()),
          filo: filo,
          oggetto: m.getSubject(),
          data: m.getDate().toISOString(),
          anteprima: m.getPlainBody().slice(0, 6000),
        });
      });
    });

    for (let i = 0; i < nuovi.length; i += 50) {
      const lotto = nuovi.slice(i, i + 50);
      chiamaCrm('posta', { messaggi: lotto });
      chiamaRichieste('posta', { messaggi: lotto });
      lotto.forEach(function (m) { visti.push(m.id); });
    }
    props.setProperty('VISTI', JSON.stringify(visti.slice(-400)));
    props.setProperty('POSTA_DAL', String(inizio));
    recuperaRichieste();
  }]);
}

/** Una volta sola: le richieste generiche delle ultime due settimane, e i nostri invii, così le già risposte non restano aperte. */
function recuperaRichieste() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('RICHIESTE_RECUPERATE')) return;
  const arrivati = [];
  messaggiDi(cerca('in:inbox newer_than:14d', 0, 100)).forEach(function (messaggi) {
    messaggi.forEach(function (m) {
      if (m.isDraft()) return;
      arrivati.push({
        id: m.getId(), da: m.getFrom(), a: indirizziIn(m.getTo()), cc: indirizziIn(m.getCc()), filo: [],
        oggetto: m.getSubject(), data: m.getDate().toISOString(), anteprima: m.getPlainBody().slice(0, 6000),
      });
    });
  });
  const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase()].concat(alias()).filter(function (x) { return x; });
  const spediti = [];
  messaggiDi(cerca('in:sent newer_than:14d', 0, 100)).forEach(function (messaggi) {
    messaggi.forEach(function (m) {
      const da = m.getFrom().toLowerCase();
      if (m.isDraft() || (miei.length && !miei.some(function (x) { return da.indexOf(x) !== -1; }))) return;
      spediti.push({ id: m.getId(), a: indirizziIn(m.getTo() + ',' + m.getCc()), oggetto: m.getSubject(), data: m.getDate().toISOString() });
    });
  });
  let ok = true;
  for (let i = 0; i < arrivati.length; i += 50) ok = chiamaRichieste('posta', { messaggi: arrivati.slice(i, i + 50) }) && ok;
  for (let i = 0; i < spediti.length; i += 50) ok = chiamaRichieste('inviati', { messaggi: spediti.slice(i, i + 50) }) && ok;
  if (ok) props.setProperty('RICHIESTE_RECUPERATE', String(Date.now()));
}

// ---------- bozze Gmail ----------

/** Ogni minuto, di giorno: crea le bozze in coda e controlla gli invii appena fatti (conferma quasi immediata
 *  nell'app). Di notte si ferma per non consumare la quota giornaliera di Google; il ripasso ogni 15 minuti resta. */
function ogniMinuto() {
  const ora = Number(Utilities.formatDate(new Date(), 'Europe/Rome', 'H'));
  if (ora < 7 || ora >= 23) return;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // un altro giro è ancora in corso
  try {
    esegui('minuto', [creaBozzeInCoda, function () {
      // Dall'ultimo controllo veloce riuscito, con 10 minuti di margine (al massimo l'ultima ora).
      const inizio = Date.now();
      inviatiDa('in:sent' + dopo(finestra('INVIATI_VELOCE_DAL', 10, 1 / 24)));
      PropertiesService.getScriptProperties().setProperty('INVIATI_VELOCE_DAL', String(inizio));
    }]);
  } finally {
    lock.releaseLock();
  }
}

/** Le bozze «in coda» nel CRM diventano vere bozze di Gmail. Mai inviate. (Si può anche eseguire a mano.) */
function elaboraBozze() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    esegui('bozze', [creaBozzeInCoda]);
  } finally {
    lock.releaseLock();
  }
}

/** Vero se nel Gmail è attivo «Invia come» info@teatronazionalefirenze.it. */
function aliasTeatro() {
  return alias().indexOf(MITTENTE) !== -1;
}

function creaBozzeInCoda() {
  const coda = (chiamaCrm('bozze_in_coda').bozze) || [];
  if (!coda.length) return;
  const fatte = [];
  const errori = [];
  const daTeatro = aliasTeatro();
  let finita = null;
  coda.forEach(function (b) {
    // Quota finita: le bozze rimaste non si segnano come errore, restano «in creazione» e il CRM le rimette in coda.
    if (finita) return;
    try {
      const opzioni = b.html ? { htmlBody: b.html } : {};
      if (daTeatro) { opzioni.from = MITTENTE; opzioni.name = NOME_MITTENTE; }
      let bozza = null;
      // Risposta a un messaggio ricevuto: la bozza nasce dentro la stessa conversazione.
      if (b.rispondi_a) {
        try { conta(2); bozza = GmailApp.getMessageById(b.rispondi_a).createDraftReply(b.testo || '', opzioni); } catch (er) {
          if (quotaFinita(er)) throw er;
          bozza = null;
        }
      }
      if (!bozza) { conta(1); bozza = GmailApp.createDraft(b.a, b.oggetto || '', b.testo || '', opzioni); }
      fatte.push({ id: b.id, draft_id: bozza.getId() });
    } catch (e) {
      if (quotaFinita(e)) finita = e;
      else errori.push({ id: b.id, errore: String(e).slice(0, 280) });
    }
  });
  if (fatte.length || errori.length) chiamaCrm('bozze_fatte', { fatte: fatte, errori: errori });
  if (finita) throw finita;
}

// ---------- messaggi inviati ----------

function indirizziIn(testo) {
  return (String(testo || '').match(/[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+/g) || []).map(function (e) { return e.toLowerCase(); });
}

/** Ogni 15 minuti: ripasso degli invii (anche quelli fatti di notte, quando il controllo veloce dorme), poi le
 *  conversazioni dei lead, quelle del team e la posta di sistema. */
function controllaInviati() {
  esegui('ripasso', [ripassoInviati, rileggiConversazioni, rileggiTeam, riordinaSistema]);
}

function ripassoInviati() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    // Dall'ultimo ripasso riuscito con un'ora di margine; al primo giro (o dopo un fermo) gli ultimi 3 giorni.
    const inizio = Date.now();
    inviatiDa('in:sent' + dopo(finestra('INVIATI_DAL', 60, 3)));
    PropertiesService.getScriptProperties().setProperty('INVIATI_DAL', String(inizio));
  } finally {
    lock.releaseLock();
  }
}

/** Le trattative del team: conversazioni in cui scrive Matteo (o in cui gli scrivono), con info@ in copia. La prima volta
 *  legge gli ultimi due mesi, 40 conversazioni per giro; poi solo quelle degli ultimi giorni che hanno messaggi nuovi. */
function rileggiTeam() {
  const props = PropertiesService.getScriptProperties();
  const cosa = chiamaCrm('team_da_leggere');
  if (!cosa.ricerca) return;
  const PASSO = 40;
  const da = Number(props.getProperty('TEAM_DA') || 0);
  const visti = JSON.parse(props.getProperty('TEAM_VISTI') || '{}');
  const fili = cerca(cosa.ricerca, da, PASSO);
  const pacchi = [];
  messaggiDi(fili).forEach(function (tutti, i) {
    const veri = tutti.filter(function (m) { return !m.isDraft(); });
    if (!veri.length) return;
    const ultimo = veri[veri.length - 1].getDate().getTime();
    const id = fili[i].getId();
    if (visti[id] === ultimo) return; // niente di nuovo in questa conversazione
    const messaggi = veri.slice(-30).map(function (m) {
      return {
        id: m.getId(),
        da: m.getFrom(),
        a: indirizziIn(m.getTo()),
        cc: indirizziIn(m.getCc()),
        oggetto: m.getSubject(),
        data: m.getDate().toISOString(),
        corpo: m.getPlainBody().slice(0, 2500),
      };
    });
    pacchi.push({ id: id, totale: tutti.length, messaggi: messaggi, ultimo: ultimo });
  });
  const finito = fili.length < PASSO || da + PASSO >= (cosa.massimo || 300);
  for (let i = 0; i < pacchi.length; i += 20) {
    const lotto = pacchi.slice(i, i + 20);
    chiamaCrm('team', { fili: lotto, fine: finito && i + 20 >= pacchi.length });
    lotto.forEach(function (f) { visti[f.id] = f.ultimo; });
  }
  if (!pacchi.length && finito) chiamaCrm('team', { fili: [], fine: true });
  props.setProperty('TEAM_DA', finito ? '0' : String(da + PASSO));
  // Si ricordano solo le 150 conversazioni più recenti (una proprietà tiene al massimo 9 KB).
  const tenuti = Object.keys(visti).sort(function (x, y) { return visti[y] - visti[x]; }).slice(0, 150);
  const piccolo = {};
  tenuti.forEach(function (k) { piccolo[k] = visti[k]; });
  props.setProperty('TEAM_VISTI', JSON.stringify(piccolo));
}

/** Rete di sicurezza: il CRM indica quali lead rileggere (al massimo 15 per volta; quelli in conversazione ogni giorno,
 *  gli altri ogni settimana) e la ricerca da fare; qui si raccolgono i messaggi e il CRM tiene solo quello che manca.
 *  Si può anche eseguire a mano. */
function rileggiConversazioni() {
  const daLeggere = (chiamaCrm('conversazioni_da_leggere').leads) || [];
  if (!daLeggere.length) return;
  // Una ricerca per lead, poi tutte le conversazioni trovate lette in una volta sola.
  const filiPerLead = daLeggere.map(function (l) { return cerca(l.ricerca, 0, 15); });
  const tutti = messaggiDi([].concat.apply([], filiPerLead));
  let k = 0;
  const letture = daLeggere.map(function (l, i) {
    const messaggi = [];
    filiPerLead[i].forEach(function () {
      tutti[k++].forEach(function (m) {
        if (m.isDraft() || messaggi.length >= 80) return;
        messaggi.push({
          id: m.getId(),
          da: m.getFrom(),
          a: indirizziIn(m.getTo() + ',' + m.getCc()),
          oggetto: m.getSubject(),
          data: m.getDate().toISOString(),
          corpo: m.getPlainBody().slice(0, 3000),
        });
      });
    });
    return { lead_id: l.id, messaggi: messaggi };
  });
  chiamaCrm('conversazioni', { letture: letture });
}

/** I messaggi inviati dal Gmail del teatro verso i lead diventano «contatto fatto» nel CRM. */
function inviatiDa(ricerca) {
  const props = PropertiesService.getScriptProperties();
  chiaveOStop();
  // Anche i messaggi spediti da Gmail «come» info@ (alias) sono nostri.
  const miei = [(Session.getEffectiveUser().getEmail() || '').toLowerCase()].concat(alias()).filter(function (x) { return x; });
  const limite = new Date(Date.now() - 3 * 86400000);
  const visti = JSON.parse(props.getProperty('VISTI_INVIATI') || '[]');
  const giaVisti = new Set(visti);
  const nuovi = [];
  messaggiDi(cerca(ricerca, 0, 100)).forEach(function (messaggi) {
    messaggi.forEach(function (m) {
      const id = m.getId();
      if (giaVisti.has(id) || m.isDraft() || m.getDate() < limite) return;
      const da = m.getFrom().toLowerCase();
      if (miei.length && !miei.some(function (x) { return da.indexOf(x) !== -1; })) return; // solo i messaggi spediti da noi
      nuovi.push({
        id: id,
        a: indirizziIn(m.getTo() + ',' + m.getCc()),
        oggetto: m.getSubject(),
        data: m.getDate().toISOString(),
        corpo: m.getPlainBody().slice(0, 4000),
      });
    });
  });
  if (!nuovi.length) return;
  for (let i = 0; i < nuovi.length; i += 50) {
    const lotto = nuovi.slice(i, i + 50);
    chiamaCrm('inviati', { messaggi: lotto });
    chiamaRichieste('inviati', { messaggi: lotto });
    lotto.forEach(function (m) { visti.push(m.id); });
  }
  // Una proprietà di Apps Script tiene al massimo 9 KB: 400 id bastano per tre giorni di invii.
  props.setProperty('VISTI_INVIATI', JSON.stringify(visti.slice(-400)));
}

// ---------- posta di sistema fuori dalla posta in arrivo ----------

const ETICHETTA_SISTEMA = 'Sistema (rimbalzi e DMARC)';
// Avvisi di mancata consegna, ritardi e report DMARC: servono al CRM, non a chi legge la posta.
const RICERCA_SISTEMA = 'in:inbox {from:mailer-daemon from:postmaster from:noreply-dmarc-support@google.com from:dmarcreport from:dmarc subject:"Report domain" subject:"Delivery Status Notification" subject:"Undeliverable" subject:"Mail delivery failed" subject:"Non recapitabile" subject:"Returned mail"}';

/** Sposta la posta di sistema fuori dalla posta in arrivo, sotto l'etichetta «Sistema (rimbalzi e DMARC)». Solo quella
 *  che il CRM ha già letto (oppure più vecchia di due giorni): così nessun rimbalzo o report va perso. Non cancella niente. */
function riordinaSistema() {
  const props = PropertiesService.getScriptProperties();
  const letti = new Set(JSON.parse(props.getProperty('VISTI') || '[]').concat(JSON.parse(props.getProperty('DMARC_VISTI') || '[]')));
  const vecchio = Date.now() - 2 * 86400000;
  const fili = cerca(RICERCA_SISTEMA, 0, 100);
  if (!fili.length) return;
  const daSpostare = [];
  messaggiDi(fili).forEach(function (messaggi, i) {
    // Una conversazione con un nostro invio e il suo rimbalzo: si sposta solo se tutti i messaggi in arrivo sono di sistema.
    const altri = messaggi.some(function (m) {
      const da = m.getFrom().toLowerCase();
      return !m.isDraft() && !/mailer-daemon|postmaster|dmarc|mimecastreport/.test(da) && !/teatronazionalefirenze/.test(da) && !/report domain/i.test(m.getSubject());
    });
    if (altri) return;
    const pronti = messaggi.every(function (m) {
      return letti.has(m.getId()) || m.getDate().getTime() < vecchio || /teatronazionalefirenze/.test(m.getFrom().toLowerCase());
    });
    if (pronti) daSpostare.push(fili[i]);
  });
  if (!daSpostare.length) return;
  conta(3);
  const etichetta = GmailApp.getUserLabelByName(ETICHETTA_SISTEMA) || GmailApp.createLabel(ETICHETTA_SISTEMA);
  etichetta.addToThreads(daSpostare);
  GmailApp.moveThreadsToArchive(daSpostare);
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
/** Ogni mattina: legge i report DMARC arrivati negli ultimi giorni e ne manda il riassunto al CRM. */
function controllaDmarc() {
  esegui('dmarc', [function () {
    const props = PropertiesService.getScriptProperties();
    chiaveOStop();
    const visti = JSON.parse(props.getProperty('DMARC_VISTI') || '[]');
    const giaVisti = new Set(visti);
    const rapporti = [];
    const nuoviId = [];
    messaggiDi(cerca('subject:"Report Domain" OR subject:"Report domain" has:attachment newer_than:14d', 0, 40)).forEach(function (messaggi) {
      messaggi.forEach(function (m) {
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
  }]);
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
`,F=100;async function I(e,t,n){for(let r=0;r<e.length;r+=F)await t(e.slice(r,r+F)),n(Math.min(r+F,e.length))}async function L(e,t,n){await I(t,async t=>{let{error:n}=await u.from(e).upsert(t,{onConflict:`id`,ignoreDuplicates:!0});if(n)throw Error(`${e}: ${n.message}`)},n)}var R=e=>(e??``).trim().toLowerCase(),z=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function B(e){let t=await a(),n=new Set(t.map(e=>R(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(z)),i=[];for(let t of e){let e=R(t.email);(e?n.has(e):r.has(z(t)))||(e?n.add(e):r.add(z(t)),i.push({...t,email:e||null}))}return{nuovi:i,saltati:e.length-i.length}}async function V(e,t){let{nuovi:n,saltati:r}=await B(e);return await I(n,async e=>{let{error:t}=await u.from(`contatti`).insert(e);if(t)throw Error(`contatti: ${t.message}`)},e=>t(`Contatti: ${e} di ${n.length}`)),{inseriti:n.length,saltati:r}}async function H(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await L(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await L(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await L(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await V(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function U(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var W={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function G(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>W[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var K=l();function q(){let{email:e,nome:t}=v(),[n,r]=(0,N.useState)([]),[i,a]=(0,N.useState)(null),o=window.matchMedia(`(display-mode: standalone)`).matches;return(0,N.useEffect)(()=>{c().then(r).catch(()=>{});let e=e=>{e.preventDefault(),a(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(`div`,{className:`testata`,children:(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,K.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,K.jsxs)(`div`,{className:`chips a-capo solo-telefono`,style:{marginBottom:14},children:[(0,K.jsx)(`button`,{className:`chip`,onClick:()=>b(`documenti`),children:`Documenti e link`}),(0,K.jsx)(`button`,{className:`chip`,onClick:()=>b(`contatti`),children:`Contatti & Partner`}),(0,K.jsx)(`button`,{className:`chip`,onClick:()=>b(`report`),children:`Report`}),(0,K.jsx)(`button`,{className:`chip`,onClick:()=>b(`ricerca`),children:`Ricerca automatica`})]}),(0,K.jsxs)(`div`,{className:`griglia-campi imp-riquadri`,children:[(0,K.jsxs)(g,{titolo:`Il tuo accesso`,chiave:`imp.accesso`,riassunto:e,children:[(0,K.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,K.jsx)(`strong`,{children:e}),`.`]}),(0,K.jsx)(`p`,{className:`piccolo`,children:`Resti collegato su questo dispositivo finché non esci.`}),(0,K.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>S(),children:[(0,K.jsx)(E,{size:15}),` Esci`]})]}),(0,K.jsx)(g,{titolo:`L’app sul telefono`,chiave:`imp.app`,riassunto:o?`Installata su questo dispositivo`:`Come aggiungerla alla schermata Home`,children:o?(0,K.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`p`,{className:`aiuto`,children:[(0,K.jsx)(A,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,K.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,K.jsxs)(`li`,{children:[(0,K.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,K.jsxs)(`li`,{children:[(0,K.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),i&&(0,K.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>i.prompt(),children:`Installa su questo dispositivo`})]})}),(0,K.jsx)(g,{titolo:`Notifiche sul telefono`,chiave:`imp.notifiche`,riassunto:`Quando un lead risponde, anche ad app chiusa`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(C,{})})}),(0,K.jsx)(g,{titolo:`La coda di ogni giorno`,chiave:`imp.coda`,riassunto:`Quante bozze al giorno e chi viene per primo`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(Z,{})})}),(0,K.jsx)(g,{titolo:`Agente delle risposte`,chiave:`imp.agente`,riassunto:`Cosa fa e le regole che ha imparato`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(Q,{})})}),(0,K.jsx)(g,{titolo:`Il Postino (bozze Gmail)`,chiave:`imp.postino`,riassunto:`Lo script nel Gmail del teatro: copia il codice`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(ee,{})})}),(0,K.jsx)(g,{titolo:`Sicurezza della posta`,chiave:`imp.posta`,riassunto:`Le email del teatro superano i controlli?`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)($,{})})}),(0,K.jsx)(g,{titolo:`Prezzi e numeri nei messaggi`,chiave:`imp.prezzi`,riassunto:`Le cifre che usano messaggi e risposte`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(J,{})})}),(0,K.jsx)(g,{titolo:`Import dal vecchio CRM`,chiave:`imp.import`,riassunto:`Carica il file preparato da Claude`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(Y,{})})}),(0,K.jsx)(g,{titolo:`Aggiungi contatti da un file`,chiave:`imp.csv`,riassunto:`Un CSV esportato da Excel`,children:(0,K.jsx)(`div`,{className:`imp-dentro`,children:(0,K.jsx)(X,{})})}),(0,K.jsxs)(g,{titolo:`Chi può entrare`,chiave:`imp.utenti`,riassunto:n.length?`${n.length} ${n.length===1?`persona`:`persone`}`:void 0,children:[(0,K.jsx)(`div`,{className:`lista`,children:n.map(e=>(0,K.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,K.jsx)(x,{size:16,style:{color:`var(--brass)`}}),(0,K.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,K.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,K.jsx)(`p`,{className:`piccolo`,children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,K.jsx)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`})]})]})}function J(){let{condizioni:t,mettiCondizioni:n}=v(),[r,i]=(0,N.useState)(t),[a,o]=(0,N.useState)(!1),[s,c]=(0,N.useState)(null),l=h.some(({chiave:e})=>r[e]!==t[e]);(0,N.useEffect)(()=>i(t),[t]);async function u(t){t.preventDefault();let i=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,t.trim()]));o(!0),c(null);try{await e(i),n(i),f(`Salvato: i prossimi messaggi usano questi dati`)}catch{c(`Non riesco a salvarli, riprova.`)}finally{o(!1)}}return(0,K.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:u,children:[(0,K.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,K.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,K.jsx)(`div`,{className:`griglia-campi due`,children:h.map(({chiave:e,etichetta:t,esempio:n})=>(0,K.jsxs)(`label`,{className:`campo`,children:[(0,K.jsx)(`span`,{children:t}),(0,K.jsx)(`input`,{className:`input`,value:r[e],placeholder:n,onChange:t=>i({...r,[e]:t.target.value})})]},e))}),(0,K.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!l,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,K.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),s&&(0,K.jsx)(`div`,{className:`errore-box`,role:`alert`,children:s})]})}function Y(){let{ricarica:e}=v(),[t,n]=(0,N.useState)(null),[r,i]=(0,N.useState)(``),[a,o]=(0,N.useState)(null),[s,c]=(0,N.useState)(null),[l,u]=(0,N.useState)(null),[d,p]=(0,N.useState)(!1);async function m(e){let t=e.target.files?.[0];if(e.target.value=``,t){u(null),c(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),i(t.name)}catch{n(null),u(`Questo file non è un pacchetto di import valido.`)}}}async function h(){if(t){p(!0),u(null);try{let r=await H(t,o);c(r),n(null),await e(),f(`Import completato`)}catch(e){u(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{p(!1),o(null)}}}return(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,K.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,K.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,K.jsx)(M,{size:15}),` Scegli il file .json`,(0,K.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:m,hidden:!0})]}),t&&(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,K.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,K.jsx)(`button`,{className:`btn btn-primario`,onClick:h,disabled:d,children:d?`Importo…`:`Importa adesso`})]}),a&&(0,K.jsx)(`p`,{className:`piccolo`,role:`status`,children:a}),s&&(0,K.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,s.leads,` lead, `,s.interazioni,` interazioni, `,s.bozze,` messaggi, `,s.contatti,` contatti nuovi`,s.contattiSaltati?` (${s.contattiSaltati} erano già in rubrica)`:``,`.`]}),l&&(0,K.jsx)(`div`,{className:`errore-box`,role:`alert`,children:l})]})}function X(){let{ricarica:e}=v(),[t,n]=(0,N.useState)(null),[r,i]=(0,N.useState)(``),[a,o]=(0,N.useState)(`hotel`),[s,c]=(0,N.useState)(``),[l,u]=(0,N.useState)(null),[d,p]=(0,N.useState)(null),[m,h]=(0,N.useState)(!1),g=()=>t?G(t,a,s.trim()||null).contatti:[];(0,N.useEffect)(()=>{if(!t)return;let{contatti:e,colonne:n}=G(t,a,s.trim()||null);B(e).then(({nuovi:t})=>u({totale:e.length,nuovi:t.length,colonne:n})).catch(()=>u({totale:e.length,nuovi:e.length,colonne:n}))},[t,a,s]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;p(null);let r=U(await t.text());if(r.length<2){p(`Il file sembra vuoto.`);return}n(r),i(t.name)}async function b(){h(!0);try{let t=await V(g(),()=>{});f(`${t.inseriti} contatti aggiunti${t.saltati?`, ${t.saltati} già presenti`:``}`),n(null),u(null),await e()}catch(e){p(e instanceof Error?e.message:`Import non riuscito.`)}finally{h(!1)}}return(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,K.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,K.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,K.jsx)(M,{size:15}),` Scegli il file .csv`,(0,K.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),t&&l&&(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,K.jsx)(`strong`,{children:r}),`: `,l.totale,` righe, di cui `,(0,K.jsxs)(`strong`,{children:[l.nuovi,` nuove`]}),`. Colonne riconosciute: `,l.colonne.join(`, `)||`nessuna`,`.`]}),(0,K.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,K.jsxs)(`label`,{className:`campo`,children:[(0,K.jsx)(`span`,{children:`Categoria`}),(0,K.jsx)(`select`,{className:`input`,value:a,onChange:e=>o(e.target.value),children:_.map(e=>(0,K.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,K.jsxs)(`label`,{className:`campo`,children:[(0,K.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,K.jsx)(`input`,{className:`input`,value:s,onChange:e=>c(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,K.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:m||!l.nuovi,children:m?`Aggiungo…`:`Aggiungi ${l.nuovi} contatti`})]}),d&&(0,K.jsx)(`div`,{className:`errore-box`,role:`alert`,children:d})]})}function Z(){let{coda:e,mettiCoda:t}=v(),[n,r]=(0,N.useState)(String(e.quanti)),[i,a]=(0,N.useState)(e.verticali),[s,c]=(0,N.useState)(String(e.tetto)),[l,u]=(0,N.useState)(!1),d=Number(n)!==e.quanti||Number(s)!==e.tetto||i.join()!==e.verticali.join(),p=e=>a(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function h(){let e=Math.min(40,Math.max(1,Math.trunc(Number(n))||10));u(!0);try{let n=Math.min(100,Math.max(5,Math.trunc(Number(s))||30)),a={quanti:e,verticali:i,tetto:n};await m(a),t(a),r(String(e)),c(String(n)),f(`Coda aggiornata`)}catch{f(`Non riesco a salvare, riprova`)}u(!1)}return(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,K.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,K.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,K.jsx)(`span`,{children:`Bozze al giorno`}),(0,K.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:n,onChange:e=>r(e.target.value)})]}),(0,K.jsxs)(`label`,{className:`campo`,style:{maxWidth:320},children:[(0,K.jsx)(`span`,{children:`Massimo di email inviate al giorno`}),(0,K.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:5,max:100,value:s,onChange:e=>c(e.target.value)}),(0,K.jsx)(`span`,{className:`piccolo`,children:`Primi contatti e follow-up insieme. Con un Gmail giovane, oltre 30 al giorno con testi simili si rischia lo spam.`})]}),(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,K.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(o).map(([e,t])=>{let n=i.indexOf(e);return(0,K.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>p(e),"aria-pressed":n>=0,children:[n>=0&&(0,K.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,K.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:h,disabled:!d||l,children:l?`Salvo…`:`Salva`})]})}function Q(){let[e,t]=(0,N.useState)(null);(0,N.useEffect)(()=>{p().then(t).catch(()=>t([]))},[]);async function n(n){if(!e||!window.confirm(`Tolgo questa regola? L’agente non la userà più.`))return;let i=e.filter((e,t)=>t!==n);try{await r(i),t(i),f(`Regola tolta`)}catch{f(`Non riesco a salvare, riprova`)}}return(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsxs)(`div`,{className:`etichetta`,children:[(0,K.jsx)(w,{size:15,style:{verticalAlign:`-3px`}}),` Agente delle risposte`]}),(0,K.jsx)(`p`,{className:`aiuto`,children:`Ogni 2 ore, dalle 8:30 alle 20:30, legge le risposte dei lead con tutta la conversazione e scrive la risposta: la trovi tra le bozze di Gmail, sotto il loro messaggio. Non invia mai niente. Eventi privati e preventivi li segnala per Matteo. Quando correggi una sua bozza prima di inviarla, impara la differenza: qui sotto le regole che ha ricavato.`})]}),e===null?(0,K.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):e.length?(0,K.jsx)(`div`,{className:`lista`,children:e.map((e,t)=>(0,K.jsxs)(`div`,{className:`fila`,style:{justifyContent:`space-between`,gap:10},children:[(0,K.jsxs)(`span`,{style:{fontSize:14},children:[e.regola,e.il?(0,K.jsxs)(`span`,{className:`piccolo`,children:[` · `,e.il]}):null]}),(0,K.jsx)(`button`,{className:`btn-testo`,onClick:()=>n(t),"aria-label":`Togli questa regola`,children:`Togli`})]},`${t}-${e.regola}`))}):(0,K.jsx)(`p`,{className:`piccolo`,children:`Ancora nessuna regola: le impara dalle prime bozze che correggi e invii.`})]})}function $(){let[e,t]=(0,N.useState)(void 0);(0,N.useEffect)(()=>{i().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),a=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),o=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),s=r?Math.round(a/r*100):0,c=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,K.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,K.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,K.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,K.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,K.jsx)(O,{size:22,style:{color:s>=95?`var(--ok)`:`var(--warn)`}}),(0,K.jsxs)(`span`,{style:{fontSize:15},children:[(0,K.jsxs)(`strong`,{children:[s,`%`]}),` dei `,r,` messaggi `,c?`dal ${c} `:``,`ha superato i controlli.`]})]}),o.length>0&&(0,K.jsx)(`div`,{className:`nota-box`,children:(0,K.jsxs)(`span`,{children:[o.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,o.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function ee(){let[e,t]=(0,N.useState)(void 0);return(0,N.useEffect)(()=>{n(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0))},[]),(0,K.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,K.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,K.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,K.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,K.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,e===void 0?`non lo so ancora`:e?(0,K.jsx)(`strong`,{style:{color:`var(--ok)`},children:`aggiornato e attivo ✓`}):(0,K.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,K.jsxs)(`details`,{children:[(0,K.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,K.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,K.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,K.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,K.jsxs)(`li`,{children:[`Apri `,(0,K.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,K.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,K.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,K.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,K.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,K.jsx)(`strong`,{children:`installa`}),` e premi `,(0,K.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,K.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>d(P,`Codice copiato: incollalo nello script`),children:[(0,K.jsx)(y,{size:15}),` Copia il codice`]})]})}export{q as Impostazioni};
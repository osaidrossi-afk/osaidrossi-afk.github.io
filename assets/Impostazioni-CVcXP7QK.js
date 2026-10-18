import{$ as e,$t as t,Dt as n,Qt as r,S as i,T as a,Ut as o,W as s,b as c,et as l,it as u,jt as d,kt as f,n as p,o as m,pt as h,r as g,s as _}from"./avvisi-Ci901ucN.js";import{t as v}from"./bot-McJP2tIz.js";import{N as y,P as b,n as x,q as S}from"./index-DE9kQnug.js";var C={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};C.node;var w=r(C),T={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};T.node;var E=r(T),D={name:`smartphone`,size:24,node:[[`rect`,{width:`14`,height:`20`,x:`5`,y:`2`,rx:`2`,ry:`2`,key:`1yt0o3`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}]]};D.node;var O=r(D),k={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};k.node;var A=r(k),j=t(),M=`/**
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
 * Questo script NON invia email e NON cancella nulla: legge, crea bozze e archivia la sola posta di sistema. Su Drive scrive solo dentro la
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
const CARTELLA_BACKUP = 'CRM Teatro — Backup';
const SETTIMANE_DA_TENERE = 10;
// Le bozze partono dall'indirizzo del teatro (alias «Invia come» del Gmail, via SMTP Aruba), non dal Gmail: così il
// destinatario vede il dominio vero e le risposte arrivano in info@ (visibili anche in Outlook). Se l'alias non c'è,
// la bozza nasce dal Gmail come prima.
const MITTENTE = 'info@teatronazionalefirenze.it';
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
    UrlFetchApp.fetch(INDIRIZZO_NOTIFICA, {
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
      }),
      muteHttpExceptions: true,
    });
  } catch (e) { /* il segnale di vita non deve mai fermare il Postino */ }
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
      lotto.forEach(function (m) { visti.push(m.id); });
    }
    props.setProperty('VISTI', JSON.stringify(visti.slice(-400)));
    props.setProperty('POSTA_DAL', String(inizio));
  }]);
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
`,N=100;async function P(e,t,n){for(let r=0;r<e.length;r+=N)await t(e.slice(r,r+N)),n(Math.min(r+N,e.length))}async function F(e,t,n){await P(t,async t=>{let{error:n}=await f.from(e).upsert(t,{onConflict:`id`,ignoreDuplicates:!0});if(n)throw Error(`${e}: ${n.message}`)},n)}var I=e=>(e??``).trim().toLowerCase(),L=e=>`${e.organizzazione??``}|${e.nome??``}`.trim().toLowerCase();async function R(e){let t=await i(),n=new Set(t.map(e=>I(e.email)).filter(Boolean)),r=new Set(t.filter(e=>!e.email).map(L)),a=[];for(let t of e){let e=I(t.email);(e?n.has(e):r.has(L(t)))||(e?n.add(e):r.add(L(t)),a.push({...t,email:e||null}))}return{nuovi:a,saltati:e.length-a.length}}async function z(e,t){let{nuovi:n,saltati:r}=await R(e);return await P(n,async e=>{let{error:t}=await f.from(`contatti`).insert(e);if(t)throw Error(`contatti: ${t.message}`)},e=>t(`Contatti: ${e} di ${n.length}`)),{inseriti:n.length,saltati:r}}async function B(e,t){let n=e.leads??[],r=e.interazioni??[],i=e.bozze??[];await F(`leads`,n,e=>t(`Lead: ${e} di ${n.length}`)),await F(`interazioni`,r,e=>t(`Interazioni: ${e} di ${r.length}`)),await F(`bozze`,i,e=>t(`Bozze: ${e} di ${i.length}`));let a=await z(e.contatti??[],t);return{leads:n.length,interazioni:r.length,bozze:i.length,contatti:a.inseriti,contattiSaltati:a.saltati}}function V(e){let t=e.replace(/^﻿/,``),n=t.split(/\r?\n/,1)[0]??``,r=(n.match(/;/g)?.length??0)>(n.match(/,/g)?.length??0)?`;`:`,`,i=[],a=[],o=``,s=!1;for(let e=0;e<t.length;e++){let n=t[e];s?n===`"`&&t[e+1]===`"`?(o+=`"`,e++):n===`"`?s=!1:o+=n:n===`"`?s=!0:n===r?(a.push(o),o=``):n===`
`||n===`\r`?(n===`\r`&&t[e+1]===`
`&&e++,a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),a=[],o=``):o+=n}return a.push(o),a.some(e=>e.trim()!==``)&&i.push(a),i}var H={EMAIL:`email`,MAIL:`email`,"E-MAIL":`email`,NOME:`nome`,REFERENTE:`nome`,PERSONA:`nome`,HOTEL:`organizzazione`,ORGANIZZAZIONE:`organizzazione`,AZIENDA:`organizzazione`,STRUTTURA:`organizzazione`,SCUOLA:`organizzazione`,ENTE:`organizzazione`,RUOLO:`ruolo`,TELEFONO:`telefono`,TEL:`telefono`,CELLULARE:`telefono`,STELLE:`stelle`,ZONA:`zona`,CITTA:`zona`,CITTÀ:`zona`,COMUNE:`zona`,FONTE:`fonte`,SITO:`sito`,WEB:`sito`,NOTE:`note`,CATEGORIA:`categoria`};function U(e,t,n){let[r,...i]=e;if(!r)return{contatti:[],colonne:[]};let a=r.map(e=>H[e.trim().toUpperCase()]??null);return{contatti:i.map(e=>{let r={categoria:t,gruppo:n,stato:`non_contattato`};return a.forEach((t,n)=>{let i=(e[n]??``).trim();t&&i&&(r[t]=i)}),r}).filter(e=>e.email||e.organizzazione||e.nome),colonne:a.filter(Boolean)}}var W=_();function G(){let{email:e,nome:t}=m(),[n,r]=(0,j.useState)([]),[i,a]=(0,j.useState)(null),o=window.matchMedia(`(display-mode: standalone)`).matches;return(0,j.useEffect)(()=>{h().then(r).catch(()=>{});let e=e=>{e.preventDefault(),a(e)};return window.addEventListener(`beforeinstallprompt`,e),()=>window.removeEventListener(`beforeinstallprompt`,e)},[]),(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(`div`,{className:`testata`,children:(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`p`,{className:`sopratitolo`,children:t||e}),(0,W.jsx)(`h1`,{className:`titolo-pagina`,children:`Impostazioni`})]})}),(0,W.jsxs)(`div`,{className:`griglia-campi`,children:[(0,W.jsxs)(`section`,{className:`blocco`,children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`Il tuo accesso`}),(0,W.jsxs)(`p`,{style:{fontSize:14.5},children:[`Sei entrato come `,(0,W.jsx)(`strong`,{children:e}),`.`]}),(0,W.jsx)(`p`,{className:`piccolo`,style:{marginTop:4},children:`Resti collegato su questo dispositivo finché non esci.`}),(0,W.jsxs)(`button`,{className:`btn btn-piccolo`,style:{marginTop:12},onClick:()=>y(),children:[(0,W.jsx)(w,{size:15}),` Esci`]})]}),(0,W.jsxs)(`section`,{className:`blocco`,children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`L’app sul telefono`}),o?(0,W.jsx)(`p`,{style:{fontSize:14.5},children:`Stai già usando l’app installata.`}):(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`p`,{className:`aiuto`,children:[(0,W.jsx)(O,{size:15,style:{verticalAlign:`-3px`}}),` Aprila dal telefono e aggiungila alla schermata Home: avrà la sua icona, come un’app vera.`]}),(0,W.jsxs)(`ul`,{className:`aiuto`,style:{margin:`8px 0 0`,paddingLeft:18},children:[(0,W.jsxs)(`li`,{children:[(0,W.jsx)(`strong`,{children:`iPhone`}),` (Safari): tocca il tasto Condividi, poi «Aggiungi alla schermata Home».`]}),(0,W.jsxs)(`li`,{children:[(0,W.jsx)(`strong`,{children:`Android`}),` (Chrome): menu ⋮ in alto a destra, poi «Installa app».`]})]}),i&&(0,W.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{marginTop:12},onClick:()=>i.prompt(),children:`Installa su questo dispositivo`})]})]}),(0,W.jsx)(x,{}),(0,W.jsx)(Y,{}),(0,W.jsx)(X,{}),(0,W.jsx)(Q,{}),(0,W.jsx)(Z,{}),(0,W.jsx)(K,{}),(0,W.jsx)(q,{}),(0,W.jsx)(J,{}),(0,W.jsxs)(`section`,{className:`blocco`,children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`Chi può entrare`}),(0,W.jsx)(`div`,{className:`lista`,children:n.map(e=>(0,W.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,W.jsx)(b,{size:16,style:{color:`var(--brass)`}}),(0,W.jsxs)(`span`,{style:{fontSize:14.5},children:[(0,W.jsx)(`strong`,{children:e.nome??e.email}),` · `,e.email]})]},e.email))}),(0,W.jsx)(`p`,{className:`piccolo`,style:{marginTop:10},children:`Per far entrare un collega, chiedi a Claude di aggiungere la sua email all’elenco.`})]}),(0,W.jsx)(`p`,{className:`piccolo`,style:{textAlign:`center`,marginTop:6},children:`Dati salvati in Europa (Francoforte). Entra solo chi è nell’elenco.`})]})]})}function K(){let{condizioni:e,mettiCondizioni:t}=m(),[r,i]=(0,j.useState)(e),[a,o]=(0,j.useState)(!1),[s,c]=(0,j.useState)(null),u=n.some(({chiave:t})=>r[t]!==e[t]);(0,j.useEffect)(()=>i(e),[e]);async function d(e){e.preventDefault();let n=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,t.trim()]));o(!0),c(null);try{await l(n),t(n),p(`Salvato: i prossimi messaggi usano questi dati`)}catch{c(`Non riesco a salvarli, riprova.`)}finally{o(!1)}}return(0,W.jsxs)(`form`,{className:`blocco griglia-campi`,onSubmit:d,children:[(0,W.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Prezzi e numeri nei messaggi`}),(0,W.jsx)(`p`,{className:`aiuto`,children:`Il generatore di messaggi li prende da qui. Se cambia un prezzo o una percentuale, lo correggi qui e basta. Un campo vuoto = la frase si scrive senza cifra (es. «tariffa netta riservata»).`}),(0,W.jsx)(`div`,{className:`griglia-campi due`,children:n.map(({chiave:e,etichetta:t,esempio:n})=>(0,W.jsxs)(`label`,{className:`campo`,children:[(0,W.jsx)(`span`,{children:t}),(0,W.jsx)(`input`,{className:`input`,value:r[e],placeholder:n,onChange:t=>i({...r,[e]:t.target.value})})]},e))}),(0,W.jsx)(`button`,{className:`btn btn-primario`,type:`submit`,disabled:a||!u,style:{justifySelf:`start`},children:a?`Salvo…`:`Salva`}),(0,W.jsx)(`p`,{className:`piccolo`,children:`Restano nel database, visibili solo a chi entra. Nel codice pubblico non c’è nessuna cifra.`}),s&&(0,W.jsx)(`div`,{className:`errore-box`,role:`alert`,children:s})]})}function q(){let{ricarica:e}=m(),[t,n]=(0,j.useState)(null),[r,i]=(0,j.useState)(``),[a,o]=(0,j.useState)(null),[s,c]=(0,j.useState)(null),[l,u]=(0,j.useState)(null),[d,f]=(0,j.useState)(!1);async function h(e){let t=e.target.files?.[0];if(e.target.value=``,t){u(null),c(null);try{let e=JSON.parse(await t.text());if(!e||typeof e!=`object`||!(`versione`in e))throw Error();n(e),i(t.name)}catch{n(null),u(`Questo file non è un pacchetto di import valido.`)}}}async function g(){if(t){f(!0),u(null);try{let r=await B(t,o);c(r),n(null),await e(),p(`Import completato`)}catch(e){u(`Import interrotto: ${e instanceof Error?e.message:`errore sconosciuto`}. Puoi rilanciarlo: quello già entrato non viene duplicato.`)}finally{f(!1),o(null)}}}return(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Import dal vecchio CRM`}),(0,W.jsx)(`p`,{className:`aiuto`,children:`Carica il file di import preparato da Claude: porta dentro lead, storia dei contatti, messaggi pronti e rubrica. Si può rilanciare senza creare doppioni.`}),(0,W.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,W.jsx)(A,{size:15}),` Scegli il file .json`,(0,W.jsx)(`input`,{type:`file`,accept:`.json,application/json`,onChange:h,hidden:!0})]}),t&&(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,W.jsx)(`strong`,{children:r}),`: `,t.leads?.length??0,` lead, `,t.interazioni?.length??0,` interazioni, `,t.bozze?.length??0,` messaggi, `,t.contatti?.length??0,` contatti.`]}),(0,W.jsx)(`button`,{className:`btn btn-primario`,onClick:g,disabled:d,children:d?`Importo…`:`Importa adesso`})]}),a&&(0,W.jsx)(`p`,{className:`piccolo`,role:`status`,children:a}),s&&(0,W.jsxs)(`p`,{style:{fontSize:14.5},role:`status`,children:[`Fatto: `,s.leads,` lead, `,s.interazioni,` interazioni, `,s.bozze,` messaggi, `,s.contatti,` contatti nuovi`,s.contattiSaltati?` (${s.contattiSaltati} erano già in rubrica)`:``,`.`]}),l&&(0,W.jsx)(`div`,{className:`errore-box`,role:`alert`,children:l})]})}function J(){let{ricarica:e}=m(),[t,n]=(0,j.useState)(null),[r,i]=(0,j.useState)(``),[a,o]=(0,j.useState)(`hotel`),[s,c]=(0,j.useState)(``),[l,u]=(0,j.useState)(null),[f,h]=(0,j.useState)(null),[g,_]=(0,j.useState)(!1),v=()=>t?U(t,a,s.trim()||null).contatti:[];(0,j.useEffect)(()=>{if(!t)return;let{contatti:e,colonne:n}=U(t,a,s.trim()||null);R(e).then(({nuovi:t})=>u({totale:e.length,nuovi:t.length,colonne:n})).catch(()=>u({totale:e.length,nuovi:e.length,colonne:n}))},[t,a,s]);async function y(e){let t=e.target.files?.[0];if(e.target.value=``,!t)return;h(null);let r=V(await t.text());if(r.length<2){h(`Il file sembra vuoto.`);return}n(r),i(t.name)}async function b(){_(!0);try{let t=await z(v(),()=>{});p(`${t.inseriti} contatti aggiunti${t.saltati?`, ${t.saltati} già presenti`:``}`),n(null),u(null),await e()}catch(e){h(e instanceof Error?e.message:`Import non riuscito.`)}finally{_(!1)}}return(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsx)(`div`,{className:`etichetta`,style:{marginBottom:0},children:`Aggiungi contatti da un file`}),(0,W.jsx)(`p`,{className:`aiuto`,children:`Un file CSV (anche esportato da Excel) con colonne come EMAIL, NOME, HOTEL o AZIENDA, RUOLO, TELEFONO. I contatti già presenti vengono saltati.`}),(0,W.jsxs)(`label`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},children:[(0,W.jsx)(A,{size:15}),` Scegli il file .csv`,(0,W.jsx)(`input`,{type:`file`,accept:`.csv,text/csv`,onChange:y,hidden:!0})]}),t&&l&&(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`p`,{style:{fontSize:14.5},children:[(0,W.jsx)(`strong`,{children:r}),`: `,l.totale,` righe, di cui `,(0,W.jsxs)(`strong`,{children:[l.nuovi,` nuove`]}),`. Colonne riconosciute: `,l.colonne.join(`, `)||`nessuna`,`.`]}),(0,W.jsxs)(`div`,{className:`griglia-campi due`,children:[(0,W.jsxs)(`label`,{className:`campo`,children:[(0,W.jsx)(`span`,{children:`Categoria`}),(0,W.jsx)(`select`,{className:`input`,value:a,onChange:e=>o(e.target.value),children:d.map(e=>(0,W.jsx)(`option`,{value:e.key,children:e.label},e.key))})]}),(0,W.jsxs)(`label`,{className:`campo`,children:[(0,W.jsx)(`span`,{children:`Nome della lista (facoltativo)`}),(0,W.jsx)(`input`,{className:`input`,value:s,onChange:e=>c(e.target.value),placeholder:`es. hotel 3 stelle ottobre`})]})]}),(0,W.jsx)(`button`,{className:`btn btn-primario`,onClick:b,disabled:g||!l.nuovi,children:g?`Aggiungo…`:`Aggiungi ${l.nuovi} contatti`})]}),f&&(0,W.jsx)(`div`,{className:`errore-box`,role:`alert`,children:f})]})}function Y(){let{coda:t,mettiCoda:n}=m(),[r,i]=(0,j.useState)(String(t.quanti)),[a,s]=(0,j.useState)(t.verticali),[c,l]=(0,j.useState)(String(t.tetto)),[u,d]=(0,j.useState)(!1),f=Number(r)!==t.quanti||Number(c)!==t.tetto||a.join()!==t.verticali.join(),h=e=>s(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);async function g(){let t=Math.min(40,Math.max(1,Math.trunc(Number(r))||10));d(!0);try{let r=Math.min(100,Math.max(5,Math.trunc(Number(c))||30)),o={quanti:t,verticali:a,tetto:r};await e(o),n(o),i(String(t)),l(String(r)),p(`Coda aggiornata`)}catch{p(`Non riesco a salvare, riprova`)}d(!1)}return(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`La coda di ogni giorno`}),(0,W.jsx)(`p`,{className:`aiuto`,children:`In «Oggi» trovi un lead alla volta, con il messaggio già pronto. Qui scegli quanti ne prepari al giorno e chi viene per primo.`})]}),(0,W.jsxs)(`label`,{className:`campo`,style:{maxWidth:220},children:[(0,W.jsx)(`span`,{children:`Bozze al giorno`}),(0,W.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:1,max:40,value:r,onChange:e=>i(e.target.value)})]}),(0,W.jsxs)(`label`,{className:`campo`,style:{maxWidth:320},children:[(0,W.jsx)(`span`,{children:`Massimo di email inviate al giorno`}),(0,W.jsx)(`input`,{className:`input`,type:`number`,inputMode:`numeric`,min:5,max:100,value:c,onChange:e=>l(e.target.value)}),(0,W.jsx)(`span`,{className:`piccolo`,children:`Primi contatti e follow-up insieme. Con un Gmail giovane, oltre 30 al giorno con testi simili si rischia lo spam.`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`p`,{className:`piccolo`,style:{marginBottom:6},children:`Chi servire per primo (tocca nell’ordine che vuoi; il numero è la precedenza)`}),(0,W.jsx)(`div`,{className:`chips a-capo`,children:Object.entries(o).map(([e,t])=>{let n=a.indexOf(e);return(0,W.jsxs)(`button`,{type:`button`,className:`chip${n>=0?` on`:``}`,onClick:()=>h(e),"aria-pressed":n>=0,children:[n>=0&&(0,W.jsx)(`span`,{className:`n`,style:{marginLeft:0,marginRight:6},children:n+1}),t]},e)})})]}),(0,W.jsx)(`button`,{className:`btn btn-primario btn-piccolo`,style:{justifySelf:`start`},onClick:g,disabled:!f||u,children:u?`Salvo…`:`Salva`})]})}function X(){let[e,t]=(0,j.useState)(null);(0,j.useEffect)(()=>{s().then(t).catch(()=>t([]))},[]);async function n(n){if(!e||!window.confirm(`Tolgo questa regola? L’agente non la userà più.`))return;let r=e.filter((e,t)=>t!==n);try{await u(r),t(r),p(`Regola tolta`)}catch{p(`Non riesco a salvare, riprova`)}}return(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`div`,{className:`etichetta`,children:[(0,W.jsx)(v,{size:15,style:{verticalAlign:`-3px`}}),` Agente delle risposte`]}),(0,W.jsx)(`p`,{className:`aiuto`,children:`Ogni 2 ore, dalle 8:30 alle 20:30, legge le risposte dei lead con tutta la conversazione e scrive la risposta: la trovi tra le bozze di Gmail, sotto il loro messaggio. Non invia mai niente. Eventi privati e preventivi li segnala per Matteo. Quando correggi una sua bozza prima di inviarla, impara la differenza: qui sotto le regole che ha ricavato.`})]}),e===null?(0,W.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):e.length?(0,W.jsx)(`div`,{className:`lista`,children:e.map((e,t)=>(0,W.jsxs)(`div`,{className:`fila`,style:{justifyContent:`space-between`,gap:10},children:[(0,W.jsxs)(`span`,{style:{fontSize:14},children:[e.regola,e.il?(0,W.jsxs)(`span`,{className:`piccolo`,children:[` · `,e.il]}):null]}),(0,W.jsx)(`button`,{className:`btn-testo`,onClick:()=>n(t),"aria-label":`Togli questa regola`,children:`Togli`})]},`${t}-${e.regola}`))}):(0,W.jsx)(`p`,{className:`piccolo`,children:`Ancora nessuna regola: le impara dalle prime bozze che correggi e invii.`})]})}function Z(){let[e,t]=(0,j.useState)(void 0);(0,j.useEffect)(()=>{a().then(t).catch(()=>t(null))},[]);let n=(e?.rapporti??[]).flatMap(e=>e.righe.map(t=>({...t,org:e.org}))),r=n.reduce((e,t)=>e+t.n,0),i=n.filter(e=>e.dkim===`pass`||e.spf===`pass`).reduce((e,t)=>e+t.n,0),o=n.filter(e=>e.dkim!==`pass`&&e.spf!==`pass`),s=r?Math.round(i/r*100):0,c=e?.rapporti.map(e=>e.da).filter(Boolean).sort()[0];return(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`Sicurezza della posta`}),(0,W.jsxs)(`p`,{className:`aiuto`,children:[`Google e Microsoft ogni giorno ti mandano un resoconto (i messaggi «Report Domain» che arrivano in info@): dicono quanti messaggi spediti a nome di `,(0,W.jsx)(`strong`,{children:`teatronazionalefirenze.it`}),` hanno superato i controlli anti-falsificazione. Più è alto, meglio le tue email arrivano in posta e non nello spam.`]})]}),e===void 0?(0,W.jsx)(`p`,{className:`piccolo`,children:`Carico…`}):!e||!r?(0,W.jsx)(`p`,{className:`piccolo`,children:`Ancora nessun dato: compare dopo che il Postino aggiornato ha letto i primi resoconti.`}):(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`div`,{className:`fila`,style:{gap:10},children:[(0,W.jsx)(E,{size:22,style:{color:s>=95?`var(--ok)`:`var(--warn)`}}),(0,W.jsxs)(`span`,{style:{fontSize:15},children:[(0,W.jsxs)(`strong`,{children:[s,`%`]}),` dei `,r,` messaggi `,c?`dal ${c} `:``,`ha superato i controlli.`]})]}),o.length>0&&(0,W.jsx)(`div`,{className:`nota-box`,children:(0,W.jsxs)(`span`,{children:[o.reduce((e,t)=>e+t.n,0),` messaggi non hanno superato i controlli`,o.slice(0,3).map(e=>` · ${e.org??`provider`} (${e.ip??`indirizzo sconosciuto`}, ${e.n})`),`. Può essere un servizio che spedisce a tuo nome senza essere configurato, oppure qualcuno che falsifica il dominio.`]})})]})]})}function Q(){let[e,t]=(0,j.useState)(void 0);return(0,j.useEffect)(()=>{c(30).then(e=>t(e.some(e=>e.gmail_stato===`in_gmail`||e.gmail_stato===`inviata`))).catch(()=>t(void 0))},[]),(0,W.jsxs)(`section`,{className:`blocco griglia-campi`,children:[(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`div`,{className:`etichetta`,children:`Il Postino (bozze Gmail)`}),(0,W.jsxs)(`p`,{className:`aiuto`,children:[`È lo script nel Gmail del teatro che trasforma i messaggi preparati qui in `,(0,W.jsx)(`strong`,{children:`vere bozze di Gmail`}),`, e che registra da solo gli invii. Lavora anche quando Claude non c’è. Va aggiornato `,(0,W.jsx)(`strong`,{children:`una sola volta`}),`.`]})]}),(0,W.jsxs)(`p`,{style:{fontSize:14},children:[`Stato:`,` `,e===void 0?`non lo so ancora`:e?(0,W.jsx)(`strong`,{style:{color:`var(--ok)`},children:`aggiornato e attivo ✓`}):(0,W.jsx)(`strong`,{style:{color:`var(--warn)`},children:`non ancora aggiornato`})]}),(0,W.jsxs)(`details`,{children:[(0,W.jsx)(`summary`,{style:{cursor:`pointer`,fontWeight:700,fontSize:14},children:`Come si aggiorna (4 passi)`}),(0,W.jsxs)(`ol`,{className:`aiuto`,style:{margin:`10px 0 0`,paddingLeft:20,display:`grid`,gap:6},children:[(0,W.jsxs)(`li`,{children:[`Qui sotto tocca `,(0,W.jsx)(`strong`,{children:`Copia il codice`}),`.`]}),(0,W.jsxs)(`li`,{children:[`Apri `,(0,W.jsx)(`strong`,{children:`script.google.com`}),` con l’account `,(0,W.jsx)(`em`,{children:`teatronazionalefirenze@gmail.com`}),` e il progetto del Postino.`]}),(0,W.jsxs)(`li`,{children:[`Nel file di codice seleziona tutto, cancella e `,(0,W.jsx)(`strong`,{children:`incolla`}),`. Premi il dischetto per salvare.`]}),(0,W.jsxs)(`li`,{children:[`In alto scegli la funzione `,(0,W.jsx)(`strong`,{children:`installa`}),` e premi `,(0,W.jsx)(`strong`,{children:`Esegui`}),`. Google chiede il permesso: accetta tutto.`]})]})]}),(0,W.jsxs)(`button`,{className:`btn btn-piccolo`,style:{justifySelf:`start`},onClick:()=>g(M,`Codice copiato: incollalo nello script`),children:[(0,W.jsx)(S,{size:15}),` Copia il codice`]})]})}export{G as Impostazioni};
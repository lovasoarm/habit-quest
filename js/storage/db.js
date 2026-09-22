const LOCAL_STATE_KEY='habit-quest-v4-state';
const STORAGE_OP_TIMEOUT=1800;
function idbAvailable(){return typeof indexedDB!=='undefined'&&(typeof location==='undefined'||location.protocol!=='file:')}
function localStorageAvailable(){try{return typeof localStorage!=='undefined'&&typeof localStorage.getItem==='function'&&typeof localStorage.setItem==='function'}catch{return false}}
function withTimeout(promise,ms,label){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`${label} a dépassé ${ms} ms.`)),ms)})]).finally(()=>clearTimeout(timer))}
function readLocalState(){if(!localStorageAvailable())return null;try{return JSON.parse(localStorage.getItem(LOCAL_STATE_KEY)||'null')}catch{return null}}
function writeLocalState(value){if(!localStorageAvailable())throw new Error('Le stockage local est indisponible dans ce navigateur.');localStorage.setItem(LOCAL_STATE_KEY,JSON.stringify({version:1,schemaVersion:SCHEMA_VERSION,savedAt:new Date().toISOString(),data:value}))}
function clearLocalState(){if(!localStorageAvailable())return;localStorage.removeItem(LOCAL_STATE_KEY)}
function reqPromise(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);
req.onerror=()=>reject(req.error||new Error('IndexedDB request failed.'))})}
function txPromise(db,names,mode,work){return new Promise((resolve,reject)=>{let result;
let settled=false;
const tx=db.transaction(names,mode);
const done=(fn)=>{if(settled)return;
settled=true;
fn()};
tx.oncomplete=()=>done(()=>resolve(result));
tx.onerror=()=>done(()=>reject(tx.error||new Error('Transaction IndexedDB échouée.')));
tx.onabort=()=>done(()=>reject(tx.error||new Error('Transaction IndexedDB annulée.')));
try{result=work(tx)}catch(error){try{tx.abort()}catch{}done(()=>reject(error))}})}
let lastPersistedSnapshot=null;

async function openDB(){return new Promise((resolve,reject)=>{if(!idbAvailable()){reject(new Error('IndexedDB indisponible.'));
return}const req=indexedDB.open(DB_NAME,DB_VERSION);
req.onupgradeneeded=()=>{const db=req.result,old=req.oldVersion;
for(const name of STORE_NAMES){if(!db.objectStoreNames.contains(name))db.createObjectStore(name,STORE_DEFS[name])}const meta=db.objectStoreNames.contains('meta')?req.transaction.objectStore('meta'):null;
if(meta&&old<2)meta.put({id:'schema-migration',from:old,to:DB_VERSION,createdAt:new Date().toISOString()})};
req.onsuccess=()=>resolve(req.result);
req.onerror=()=>reject(req.error||new Error('Impossible d’ouvrir IndexedDB.'))})}
async function readStoreSnapshot(db){return txPromise(db,STORE_NAMES,'readonly',tx=>{const out={};
for(const name of STORE_NAMES){const req=tx.objectStore(name).getAll();
req.onsuccess=()=>{out[name]=req.result}}return out})}
async function dbRead(){const db=await openDB();
try{return await readStoreSnapshot(db)}finally{db.close()}}
function isPlainObject(value){return Boolean(value&&typeof value==='object'&&!Array.isArray(value))}
function isFiniteNumber(value){return typeof value==='number'&&Number.isFinite(value)}
const SAFE_ID_RE=/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function isSafeId(value){return typeof value==='string'&&SAFE_ID_RE.test(value)}
function isNonNegativeInt(value,max=Number.MAX_SAFE_INTEGER){return Number.isInteger(value)&&value>=0&&value<=max}
function validDay(value){if(typeof value!=='string'||!/^(\d{4})-(\d{2})-(\d{2})$/.test(value))return false;
const d=parseDay(value);
return !Number.isNaN(d.getTime())&&isoDay(d)===value}
function validIso(value){return typeof value==='string'&&Number.isFinite(Date.parse(value))}
function uniqueField(errors,items,label){const ids=new Set();
for(const x of items){if(!x?.id||typeof x.id!=='string')errors.push(`${label}: identifiant absent.`);
else if(!isSafeId(x.id))errors.push(`${label}: identifiant malformé ${x.id}.`);
else if(ids.has(x.id))errors.push(`${label}: identifiant dupliqué ${x.id}.`);
else ids.add(x.id)}}
function validateState(value){
  const errors=[];
  const fail=(cond,msg)=>{if(!cond)errors.push(msg)};
  fail(isPlainObject(value),'État absent ou invalide.');
  if(!isPlainObject(value))return {ok:false,errors};
  fail(Number(value.schemaVersion)===SCHEMA_VERSION,'Version de schéma invalide.');
  fail(isPlainObject(value.profile)&&isSafeId(value.profile.id),'Profil invalide.');
  if(isPlainObject(value.profile)){
    fail(typeof value.profile.name==='string'&&value.profile.name.trim().length>0&&value.profile.name.length<=24,'Nom de profil invalide.');
    fail(typeof value.profile.title==='string'&&value.profile.title.length<=40,'Titre de profil invalide.');
    fail(isNonNegativeInt(value.profile.xp),'XP de profil invalide.');
    fail(isNonNegativeInt(value.profile.coins),'Pièces de profil invalides.');
    const a=value.profile.appearance;
    fail(isPlainObject(a),'Apparence de profil invalide.');
    if(isPlainObject(a)){
      fail(APPEARANCE_OPTIONS.hair.some(x=>x.id===a.hair),'Cheveux invalides.');
      fail(APPEARANCE_OPTIONS.outfit.some(x=>x.id===a.outfit),'Tenue invalide.');
      fail(APPEARANCE_OPTIONS.accent.some(x=>x.id===a.accent),'Accent invalide.');
    }
    fail(Array.isArray(value.profile.unlockedTitles),'Titres déverrouillés invalides.');
    fail(isPlainObject(value.profile.equipped),'Équipement invalide.');
    if(Array.isArray(value.profile.unlockedTitles))fail(value.profile.unlockedTitles.every(id=>TITLE_OPTIONS.some(x=>x.id===id)),'Titre inconnu dans le profil.');
    if(isPlainObject(value.profile.equipped))for(const slot of ['neck','hand','charm','relic']){const id=value.profile.equipped[slot];
fail(id===null||id===undefined||REWARDS.some(x=>x.id===id),`Équipement ${slot} invalide.`)}
    fail(value.profile.activeCompanionId==null||COMPANIONS.some(x=>x.id===value.profile.activeCompanionId),'Compagnon actif invalide.');
  }
  for(const key of SCHEMA_REQUIRED_ARRAYS)fail(Array.isArray(value[key]),`${key} invalide.`);
  const arrays=SCHEMA_REQUIRED_ARRAYS.filter(k=>Array.isArray(value[k]));
  const habits=value.habits||[];
 const habitIds=new Set(habits.map(x=>x?.id).filter(Boolean));
  uniqueField(errors,habits,'habitude');
  const substepIds=new Set();
  for(const h of habits){
    if(!isPlainObject(h))continue;
    fail(isSafeId(h.id),'Habitude sans identifiant ou identifiant malformé.');
    fail(typeof h.title==='string'&&h.title.trim().length>0&&h.title.length<=60,`Titre d’habitude invalide (${h.id}).`);
    fail(typeof h.desc==='string'&&h.desc.length<=240,`Description d’habitude invalide (${h.id}).`);
    fail(CATEGORIES.some(c=>c.id===h.category),`Catégorie d’habitude invalide (${h.id}).`);
    fail(CATEGORIES.some(c=>c.icon===h.icon),`Icône d’habitude invalide (${h.id}).`);
    fail(typeof h.color==='string'&&/^#[0-9A-Fa-f]{6}$/.test(h.color),`Couleur d’habitude invalide (${h.id}).`);
    fail(SCHEMA_DIFFICULTIES.has(h.difficulty),`Difficulté d’habitude invalide (${h.id}).`);
    fail(SCHEMA_FREQUENCIES.has(h.frequency),`Fréquence d’habitude invalide (${h.id}).`);
    fail(Array.isArray(h.days)&&h.days.every(d=>Number.isInteger(d)&&d>=0&&d<=6)&&new Set(h.days).size===h.days.length,`Jours d’habitude invalides (${h.id}).`);
    if(h.frequency==='weekly'||h.frequency==='specific')fail(h.days.length>0,`Jours requis pour l’habitude ${h.id}.`);
    fail(typeof h.targetTime==='string'&&(/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(h.targetTime)||h.targetTime===''),`Heure cible invalide (${h.id}).`);
    fail(isNonNegativeInt(h.xp,100)&&h.xp>=5,`XP d’habitude invalide (${h.id}).`);
    fail(isNonNegativeInt(h.importance,3)&&h.importance>=1,`Importance invalide (${h.id}).`);
    fail(isNonNegativeInt(h.duration,240)&&h.duration>=1,`Durée invalide (${h.id}).`);
    fail(typeof h.archived==='boolean',`Statut d’archive invalide (${h.id}).`);
    fail(h.companionId==null||COMPANIONS.some(c=>c.id===h.companionId),`Compagnon d’habitude invalide (${h.id}).`);
    fail(h.startDate==null||validDay(h.startDate),`Date de début invalide (${h.id}).`);
 fail(h.endDate==null||validDay(h.endDate),`Date de fin invalide (${h.id}).`);
    if(h.startDate&&h.endDate)fail(h.startDate<=h.endDate,`Intervalle de dates invalide (${h.id}).`);
    fail(Array.isArray(h.substeps),`Sous-étapes invalides (${h.id}).`);
    if(Array.isArray(h.substeps)){for(const st of h.substeps){fail(isPlainObject(st)&&isSafeId(st.id)&&typeof st.title==='string'&&st.title.trim().length>0&&st.title.length<=120,`Sous-étape invalide (${h.id}).`);
if(st?.id){const key=`${h.id}:${st.id}`;
fail(!substepIds.has(key),`Sous-étape dupliquée (${key}).`);
substepIds.add(key)}}}
  }
  const comps=value.completions||[], seenCompDates=new Set();
 uniqueField(errors,comps,'complétion');
  for(const c of comps){if(!isPlainObject(c))continue;
fail(habitIds.has(c.habitId),`Complétion liée à une habitude inconnue (${c.id}).`);
fail(validDay(c.date),`Date de complétion invalide (${c.id}).`);
fail(c.source==null||SCHEMA_SOURCES.has(c.source),`Source de complétion invalide (${c.id}).`);
fail(isFiniteNumber(c.xp)&&c.xp>=0&&c.xp<=100,`XP de complétion invalide (${c.id}).`);
fail(c.category==null||CATEGORIES.some(x=>x.id===c.category),`Catégorie de complétion invalide (${c.id}).`);
const key=`${c.habitId}:${c.date}`;
fail(!seenCompDates.has(key),`Complétion dupliquée pour ${key}.`);
seenCompDates.add(key);
fail(c.rewardRef==null||typeof c.rewardRef==='string',`Référence de récompense invalide (${c.id}).`)}
  const steps=value.substepCompletions||[];
 uniqueField(errors,steps,'sous-complétion');
 const seenSteps=new Set();
  for(const x of steps){if(!isPlainObject(x))continue;
const h=habits.find(h=>h.id===x.habitId);
fail(Boolean(h),`Sous-complétion liée à une habitude inconnue (${x.id}).`);
fail(Boolean(h?.substeps?.some(st=>st.id===x.substepId)),`Sous-complétion liée à une étape inconnue (${x.id}).`);
fail(validDay(x.date),`Date de sous-complétion invalide (${x.id}).`);
const key=`${x.habitId}:${x.substepId}:${x.date}`;
fail(!seenSteps.has(key),`Sous-complétion dupliquée ${key}.`);
seenSteps.add(key)}
  const ch=value.challengeCompletions||[];
 uniqueField(errors,ch,'défi');
 const seenCh=new Set();
  for(const x of ch){if(!isPlainObject(x))continue;
fail(CHALLENGES.some(c=>c.id===x.challengeId),`Défi inconnu (${x.id}).`);
fail(validDay(x.date),`Date de défi invalide (${x.id}).`);
fail(isFiniteNumber(x.xp)&&x.xp>=0&&x.xp<=100,`XP de défi invalide (${x.id}).`);
const key=`${x.challengeId}:${x.date}`;
fail(!seenCh.has(key),`Défi répété le même jour (${key}).`);
seenCh.add(key)}
  const quests=value.questRuns||[];
 uniqueField(errors,quests,'quête');
 const questDefs=new Map(QUEST_DEFS.map(x=>[x.id,x]));
  for(const q of quests){if(!isPlainObject(q))continue;
const def=questDefs.get(q.defId);
fail(Boolean(def),`Définition de quête inconnue (${q.id}).`);
fail(['daily','weekly','monthly','season'].includes(q.period),`Période de quête invalide (${q.id}).`);
fail(validDay(q.start)&&validDay(q.end)&&q.start<=q.end,`Fenêtre de quête invalide (${q.id}).`);
fail(isNonNegativeInt(q.target)&&isNonNegativeInt(q.progress)&&q.progress<=q.target,`Progression de quête invalide (${q.id}).`);
fail(typeof q.claimed==='boolean'&&((q.claimedAt==null)||validIso(q.claimedAt)),`État de quête invalide (${q.id}).`);
if(def)fail(q.key===`${q.defId}:${q.start}`,`Clé de quête incohérente (${q.id}).`)}
  const companions=value.companions||[];
 uniqueField(errors,companions,'compagnon');
  for(const c of companions){if(!isPlainObject(c))continue;
fail(COMPANIONS.some(x=>x.id===c.id),`Compagnon inconnu (${c.id}).`);
fail(isFiniteNumber(c.totalAffinity)&&c.totalAffinity>=0&&c.totalAffinity<=999,`Affinité invalide (${c.id}).`);
fail(isNonNegativeInt(c.level,20)&&c.level>=1,`Niveau compagnon invalide (${c.id}).`);
fail(c.evolutionTier===companionTierFromAffinity(c.totalAffinity),`Palier compagnon incohérent (${c.id}).`);
fail(c.affinity===c.totalAffinity%100,`Affinité affichée incohérente (${c.id}).`);
fail(Array.isArray(c.appearances)&&c.appearances.every(a=>SCHEMA_COMPANION_APPEARANCES.has(a))&&new Set(c.appearances).size===c.appearances.length,`Apparences compagnon invalides (${c.id}).`);
fail(SCHEMA_COMPANION_APPEARANCES.has(c.activeAppearance),`Apparence active invalide (${c.id}).`);
fail(c.appearances?.includes(c.activeAppearance),`Apparence active absente (${c.id}).`);
fail(typeof c.unlocked==='boolean',`Statut de déblocage compagnon invalide (${c.id}).`)}
  const journal=value.journal||[];
 uniqueField(errors,journal,'journal');
 for(const j of journal){if(!isPlainObject(j))continue;
fail(validDay(j.date),`Date de journal invalide (${j.id}).`);
fail(['win','streak','companion','achievement','level','challenge','ritual','reward','quest','season','event','note'].includes(j.type),`Type de journal invalide (${j.id}).`);
for(const k of ['title','body'])fail(typeof j[k]==='string'&&j[k].length<=500,`Entrée de journal invalide (${j.id}).`)}
  const labs=value.labs||[];
 uniqueField(errors,labs,'laboratoire');
 for(const l of labs){if(!isPlainObject(l))continue;
fail(typeof l.name==='string'&&l.name.trim().length>0&&l.name.length<=48,`Nom de laboratoire invalide (${l.id}).`);
fail(Array.isArray(l.habitIds)&&l.habitIds.length>0&&l.habitIds.every(id=>habitIds.has(id)),`Habitudes de laboratoire invalides (${l.id}).`);
fail(isNonNegativeInt(l.duration,60)&&l.duration>=2,`Durée de laboratoire invalide (${l.id}).`);
fail(validDay(l.startedAt),`Date de laboratoire invalide (${l.id}).`);
fail(l.status==='active'||l.status==='complete',`Statut de laboratoire invalide (${l.id}).`);
fail(Array.isArray(l.observations)&&Array.isArray(l.measurements),`Mesures de laboratoire invalides (${l.id}).`)}
  const rituals=value.rituals||[];
 uniqueField(errors,rituals,'rituel');
 const ritualIds=new Set(rituals.map(r=>r?.id).filter(Boolean));
 for(const r of rituals){if(!isPlainObject(r))continue;
fail(typeof r.name==='string'&&r.name.trim().length>0&&r.name.length<=48,`Nom de rituel invalide (${r.id}).`);
fail(Array.isArray(r.habitIds)&&r.habitIds.length>=2&&r.habitIds.every(id=>habitIds.has(id))&&new Set(r.habitIds).size===r.habitIds.length,`Étapes de rituel invalides (${r.id}).`);
fail(isNonNegativeInt(r.bonusXp,100)&&r.bonusXp<=100,`Bonus de rituel invalide (${r.id}).`);
}
  const rr=value.ritualCompletions||[];
 uniqueField(errors,rr,'run de rituel');
 for(const x of rr){if(!isPlainObject(x))continue;
fail(ritualIds.has(x.ritualId),`Run de rituel inconnu (${x.id}).`);
fail(validDay(x.date),`Date de rituel invalide (${x.id}).`);
fail(isFiniteNumber(x.xp)&&x.xp>=0&&x.xp<=1000,`XP de rituel invalide (${x.id}).`);
fail(isFiniteNumber(x.bonus)&&x.bonus>=0&&x.bonus<=100,`Bonus de rituel invalide (${x.id}).`);
fail(Array.isArray(x.steps),`Étapes de run invalides (${x.id}).`);
fail(x.rewardRef==null||typeof x.rewardRef==='string',`Référence de récompense de rituel invalide (${x.id}).`)}
  fail(Array.isArray(value.game?.rewardXp),'Ledger XP invalide.');
  if(Array.isArray(value.game?.rewardXp)){uniqueField(errors,value.game.rewardXp,'ledger XP');
for(const x of value.game.rewardXp){if(!isPlainObject(x))continue;
fail(isFiniteNumber(x.amount)&&x.amount>=0&&x.amount<=1000,`Montant de ledger invalide (${x.id}).`);
fail(isFiniteNumber(x.coins)&&x.coins>=0&&x.coins<=1000,`Pièces de ledger invalides (${x.id}).`);
fail(typeof x.source==='string'&&x.source.length<=160,`Source de ledger invalide (${x.id}).`);
fail(validDay(x.date),`Date de ledger invalide (${x.id}).`)}}
  fail(Array.isArray(value.inventory)&&value.inventory.every(id=>REWARDS.some(r=>r.id===id))&&new Set(value.inventory).size===value.inventory.length,'Inventaire invalide.');
  fail(Array.isArray(value.game?.claimedRewards)&&value.game.claimedRewards.every(id=>REWARDS.some(r=>r.id===id))&&new Set(value.game.claimedRewards).size===value.game.claimedRewards.length,'Récompenses réclamées invalides.');
  fail(Array.isArray(value.game?.completedAchievements)&&value.game.completedAchievements.every(id=>ACHIEVEMENTS.some(a=>a.id===id))&&new Set(value.game.completedAchievements).size===value.game.completedAchievements.length,'Succès terminés invalides.');
  const st=value.game?.settings;
 fail(isPlainObject(st)&&['selectedTheme','highContrast','reducedMotion','sound','volume'].every(k=>k in st),'Préférences métier invalides.');
 if(isPlainObject(st)){fail(['night','paper'].includes(st.selectedTheme),'Thème invalide.');
for(const k of ['highContrast','reducedMotion','sound'])fail(typeof st[k]==='boolean',`Préférence ${k} invalide.`);
fail(isFiniteNumber(st.volume)&&st.volume>=0&&st.volume<=1,'Volume invalide.')}
  const ev=value.game?.event;
 fail(isPlainObject(ev)&&validDay(ev.startDate),'Événement invalide.');
 if(isPlainObject(ev)){fail(isNonNegativeInt(ev.target,100)&&ev.target>=1,'Cible d’événement invalide.');
fail(isNonNegativeInt(ev.progress,100)&&ev.progress<=ev.target,'Progression d’événement invalide.');
fail(typeof ev.claimed==='boolean','État d’événement invalide.');
fail(Array.isArray(ev.evidence)&&ev.evidence.every(validDay),'Preuves d’événement invalides.')}
  const se=value.game?.season;
 fail(isPlainObject(se)&&typeof se.id==='string'&&validDay(se.startDate),'Saison invalide.');
 if(isPlainObject(se)){fail(isNonNegativeInt(se.durationDays,366)&&se.durationDays>=1,'Durée de saison invalide.');
fail(isNonNegativeInt(se.day,se.durationDays)&&se.day>=1,'Jour de saison invalide.');
fail(Array.isArray(se.history),'Historique de saison invalide.');
fail(isPlainObject(se.stats),'Statistiques de saison invalides.');
}
  const campaign=value.game?.campaign;
 fail(isPlainObject(campaign)&&typeof campaign.currentRegion==='string'&&Array.isArray(campaign.exploredRegions)&&campaign.exploredRegions.every(id=>REGIONS.some(r=>r.id===id)),'Campagne invalide.');
fail(Array.isArray(value.game?.unlockedRegions)&&value.game.unlockedRegions.every(id=>REGIONS.some(r=>r.id===id)),'Régions déverrouillées invalides.');
  return {ok:errors.length===0,errors:[...new Set(errors)]};
}
function dbWrite(value){const checked=validateState(value);
if(!checked.ok)return Promise.reject(new Error(`État refusé : ${checked.errors.join(' ')}`));
return openDB().then(async db=>{try{await txPromise(db,STORE_NAMES,'readwrite',tx=>{for(const name of STORE_NAMES)tx.objectStore(name).clear();
const put=(store,obj)=>tx.objectStore(store).put(obj);
put('meta',{id:'main',schemaVersion:SCHEMA_VERSION,appVersion:APP_VERSION,updatedAt:new Date().toISOString()});
put('meta',{id:'integrity',arrays:SCHEMA_REQUIRED_ARRAYS,storeCount:STORE_NAMES.length,dbVersion:DB_VERSION,updatedAt:new Date().toISOString()});
put('profile',value.profile);
for(const h of value.habits)put('habits',h);
for(const x of value.completions)put('completions',x);
for(const x of value.substepCompletions)put('substeps',x);
for(const x of value.challengeCompletions)put('challenges',x);
for(const x of value.questRuns)put('quests',x);
for(const x of value.game.rewardXp||[])put('rewardXp',x);
for(const x of value.companions)put('companions',x);
for(const x of value.journal)put('journal',x);
for(const x of value.labs)put('labs',x);
for(const x of value.rituals)put('rituals',x);
for(const x of value.ritualCompletions)put('ritualRuns',x);
for(const id of value.game.claimedRewards)put('rewards',{id,claimed:true,updatedAt:new Date().toISOString()});
for(const id of value.inventory)put('inventory',{id});
for(const id of value.game.completedAchievements)put('achievements',{id,claimed:true,updatedAt:new Date().toISOString()});
put('campaign',{id:'main',unlockedRegions:value.game.unlockedRegions,claimedSeasonGoals:value.game.claimedSeasonGoals,claimedDailyTreasures:value.game.claimedDailyTreasures,dailyTreasureVersion:value.game.dailyTreasureVersion});
put('events',{id:'main',...value.game.event});
put('seasons',{id:'main',...value.game.season});
put('settings',{id:'main',...value.game.settings});
for(const x of value.game.event.evidence||[])put('eventEvidence',Object.assign({id:x.date},x));
for(const s of value.game.season.history||[])put('seasonRuns',Object.assign({id:s.id},s));
for(const l of value.labs)for(const obs of l.observations||[])put('labObservations',Object.assign({id:`${l.id}:${obs.at||obs.id}`},obs,{labId:l.id}));
});
}finally{db.close()}})}
function reconstructStores(data){if(!data)return null;
const s=migrateState({schemaVersion:SCHEMA_VERSION,meta:{id:'main'},profile:data.profile?.[0]||null,habits:Array.isArray(data.habits)?data.habits:[],completions:Array.isArray(data.completions)?data.completions:[],substepCompletions:Array.isArray(data.substeps)?data.substeps:[],challengeCompletions:Array.isArray(data.challenges)?data.challenges:[],questRuns:Array.isArray(data.quests)?data.quests:[],companions:Array.isArray(data.companions)?data.companions:[],journal:Array.isArray(data.journal)?data.journal:[],labs:Array.isArray(data.labs)?data.labs:[],rituals:Array.isArray(data.rituals)?data.rituals:[],ritualCompletions:Array.isArray(data.ritualRuns)?data.ritualRuns:[],inventory:Array.isArray(data.inventory)?data.inventory.filter(x=>x&&x.id).map(x=>x.id):[],game:{rewardXp:Array.isArray(data.rewardXp)?data.rewardXp:[],claimedRewards:Array.isArray(data.rewards)?data.rewards.filter(x=>x.claimed).map(x=>x.id):[],completedAchievements:Array.isArray(data.achievements)?data.achievements.filter(x=>x.claimed).map(x=>x.id):[]}})||seededState();
const one=(name)=>Array.isArray(data[name])?data[name]:[];
if(data.profile?.[0])s.profile=data.profile[0];
s.habits=one('habits');
s.completions=one('completions');
s.substepCompletions=one('substeps');
s.challengeCompletions=one('challenges');
s.questRuns=one('quests');
s.game.rewardXp=one('rewardXp');
s.companions=one('companions');
s.journal=one('journal');
s.labs=one('labs');
s.rituals=one('rituals');
s.ritualCompletions=one('ritualRuns');
s.game.claimedRewards=one('rewards').filter(x=>x.claimed).map(x=>x.id);
s.inventory=one('inventory').map(x=>x.id);
s.game.completedAchievements=one('achievements').filter(x=>x.claimed).map(x=>x.id);
const campaign=data.campaign?.[0],ev=data.events?.[0],season=data.seasons?.[0],settings=data.settings?.[0];
if(campaign){s.game.unlockedRegions=campaign.unlockedRegions||s.game.unlockedRegions;
s.game.claimedSeasonGoals=campaign.claimedSeasonGoals||[];
s.game.claimedDailyTreasures=campaign.claimedDailyTreasures||[];
s.game.dailyTreasureVersion=campaign.dailyTreasureVersion||1}if(ev)s.game.event=Object.assign(s.game.event,ev);
if(season)s.game.season=Object.assign(s.game.season,season);
if(settings)s.game.settings=Object.assign(s.game.settings,settings);
const evidence=one('eventEvidence').map(x=>x.date).filter(Boolean);
if(evidence.length)s.game.event.lanterns=[...new Set(evidence)].sort();
const history=one('seasonRuns');
if(history.length)s.game.season.history=history.map(({id,...rest})=>rest);
for(const l of s.labs){l.observations=one('labObservations').filter(x=>x.labId===l.id).map(({labId,...rest})=>rest)}return s}
async function readLegacyDatabase(name){try{if(typeof indexedDB.databases==='function'){const dbs=await indexedDB.databases();
if(!dbs.some(x=>x.name===name))return null}const db=await new Promise((resolve,reject)=>{const req=indexedDB.open(name);
req.onsuccess=()=>resolve(req.result);
req.onerror=()=>reject(req.error||new Error('Impossible d’ouvrir la base historique.'))});
const names=[...db.objectStoreNames].filter(Boolean);
if(!names.length){db.close();
return null}const data=await txPromise(db,names,'readonly',tx=>{const out={};
for(const n of names){const req=tx.objectStore(n).getAll();
req.onsuccess=()=>{out[n]=req.result}}return out});
db.close();
return data}catch(e){return null}}

async function readLegacyV2(){try{if(typeof indexedDB.databases==='function'){const dbs=await indexedDB.databases();
if(!dbs.some(x=>x.name===LEGACY_DB_NAME))return null}const db=await new Promise((resolve,reject)=>{const req=indexedDB.open(LEGACY_DB_NAME);
req.onsuccess=()=>resolve(req.result);
req.onerror=()=>reject(req.error)});
if(!db.objectStoreNames.contains('state')){db.close();
return null}const value=await reqPromise(db.transaction('state','readonly').objectStore('state').get('main')).catch(()=>null);
db.close();
return value?.value||null}catch(e){return null}}
async function readLegacyLocal(){try{return JSON.parse(localStorage.getItem(LEGACY_LS_KEY)||'null')}catch(e){return null}}
async function migrateLegacyIfPresent(){const legacyDb=await readLegacyDatabase(LEGACY_DB_NAME_V3);
if(legacyDb&&legacyDb.meta){const legacy=reconstructStores(legacyDb);
if(legacy)return legacy}const legacy=await readLegacyV2()||await readLegacyLocal();
if(!legacy)return null;
const migrated=mergeSeed(legacy);
try{localStorage.removeItem(LEGACY_LS_KEY)}catch(e){}return migrated}
async function migrateLegacyLocalOnly(){const legacy=await readLegacyLocal();
if(!legacy)return null;
const migrated=mergeSeed(legacy);
try{localStorage.removeItem(LEGACY_LS_KEY)}catch(e){}return migrated}
async function loadState(){
  if(!idbAvailable()){
    const local=readLocalState();
    if(local?.data){
      const migrated=migrateState(local.data);
      if(migrated){storageMode='localstorage';lastPersistedSnapshot=JSON.parse(JSON.stringify(migrated));return migrated}
    }
    const legacy=await migrateLegacyLocalOnly();
    if(legacy){storageMode='localstorage';writeLocalState(legacy);lastPersistedSnapshot=JSON.parse(JSON.stringify(legacy));return legacy}
    const seeded=seededState();
    try{writeLocalState(seeded);storageMode='localstorage';lastPersistedSnapshot=JSON.parse(JSON.stringify(seeded));return seeded}
    catch{storageMode='memory';lastPersistedSnapshot=JSON.parse(JSON.stringify(seeded));return seeded}
  }
  storageMode='indexeddb';
  const data=await withTimeout(dbRead(),STORAGE_OP_TIMEOUT,'Lecture IndexedDB');
if(data?.meta?.some(x=>x.id==='main')){const raw=reconstructStores(data);
const migrated=mergeSeed(raw);
await dbWrite(migrated);
lastPersistedSnapshot=JSON.parse(JSON.stringify(migrated));
return migrated}
const local=readLocalState();
if(local?.data){
  const migrated=migrateState(local.data);
  if(migrated){
    await dbWrite(migrated);
    try{clearLocalState()}catch{}
    lastPersistedSnapshot=JSON.parse(JSON.stringify(migrated));
    return migrated
  }
}
const legacy=await migrateLegacyIfPresent();
if(legacy){await dbWrite(legacy);
lastPersistedSnapshot=JSON.parse(JSON.stringify(legacy));
return legacy}const seeded=seededState();
await dbWrite(seeded);
lastPersistedSnapshot=JSON.parse(JSON.stringify(seeded));
return seeded}
async function persist(candidate=state){const next=migrateState(JSON.parse(JSON.stringify(candidate)));
const valid=validateState(next);
if(!valid.ok)throw new Error(valid.errors.join(' '));
if(storageMode==='memory'){state=next;lastPersistedSnapshot=JSON.parse(JSON.stringify(next));return}
if(storageMode==='localstorage'){try{writeLocalState(next);state=next;lastPersistedSnapshot=JSON.parse(JSON.stringify(next));return}catch(error){if(lastPersistedSnapshot)state=JSON.parse(JSON.stringify(lastPersistedSnapshot));throw error}}
storageMode='indexeddb';
try{await withTimeout(dbWrite(next),STORAGE_OP_TIMEOUT,'Écriture IndexedDB');state=next;lastPersistedSnapshot=JSON.parse(JSON.stringify(next))}
catch(error){
  if(lastPersistedSnapshot)state=JSON.parse(JSON.stringify(lastPersistedSnapshot));
  throw error
}}
async function clearPersist(){if(storageMode==='localstorage'){clearLocalState();return}if(storageMode==='memory')return;const db=await withTimeout(openDB(),STORAGE_OP_TIMEOUT,'Ouverture IndexedDB');
try{await withTimeout(txPromise(db,STORE_NAMES,'readwrite',tx=>{for(const name of STORE_NAMES)tx.objectStore(name).clear()}),STORAGE_OP_TIMEOUT,'Effacement IndexedDB')}finally{db.close()}}
function prefs(){try{const current=localStorage.getItem(PREF_KEY);
if(current)return JSON.parse(current);
for(const key of LEGACY_PREF_KEYS){const raw=localStorage.getItem(key);
if(raw){const parsed=JSON.parse(raw);
localStorage.setItem(PREF_KEY,JSON.stringify(parsed));
return parsed}}return {}}catch(e){return {}}}
function applyPrefs(){const p=prefs(),st=state?.game?.settings||{};
const accent={amber:'#d9b65b',leaf:'#78a96f',sky:'#7892ca',violet:'#a875b5'}[state?.profile?.appearance?.accent||'amber']||'#d9b65b';
document.documentElement.style.setProperty('--hero-accent',accent);
document.documentElement.dataset.theme=p.theme||st.selectedTheme||'night';
document.documentElement.dataset.contrast=(p.contrast??st.highContrast)?'high':'';
document.documentElement.classList.toggle('reduced-motion',Boolean(p.reducedMotion??st.reducedMotion));
document.documentElement.dataset.audio=(p.sound??st.sound)?'on':'off'}
const SOUND_FILES={complete:'assets/sounds/quest-complete.wav',reward:'assets/sounds/reward.wav',level:'assets/sounds/level-up.wav',event:'assets/sounds/event.wav'};
function playSound(kind){const p=prefs(),st=state?.game?.settings||{};
if(!(p.sound??st.sound))return;
try{const audio=new Audio(SOUND_FILES[kind]||SOUND_FILES.complete);
audio.volume=clamp(Number(p.volume??st.volume??0.75),0,1);
audio.currentTime=0;
audio.play().catch(()=>{try{console.warn('Lecture audio refusée ou indisponible.',kind)}catch{}})}catch(e){}}

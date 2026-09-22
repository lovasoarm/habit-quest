(function(){
'use strict';
// === js/data/catalog.js ===
'use strict';

const DAY_MS=86400000;
const APP_VERSION='4.1.1';
const SCHEMA_VERSION=8;
const DB_NAME='habit-quest-v4-db';
const LEGACY_DB_NAME_V3='habit-quest-v3-db';
const LEGACY_DB_NAME='habit-quest-v2-db';
const DB_VERSION=8;
const LEGACY_LS_KEY='habit-quest-v2-state';
const PREF_KEY='habit-quest-v4-prefs';
const LEGACY_PREF_KEYS=['habit-quest-v3-prefs'];


const APPEARANCE_OPTIONS={
 hair:[{id:'short',name:'Courts'},{id:'long',name:'Longs'},{id:'hood',name:'Capuche'}],
 outfit:[{id:'traveler',name:'Voyageur'},{id:'scholar',name:'Archiviste'},{id:'night',name:'Veilleur'}],
 accent:[{id:'amber',name:'Ambre'},{id:'leaf',name:'Feuille'},{id:'sky',name:'Ciel'},{id:'violet',name:'Violet'}]
};
const TITLE_OPTIONS=[
 {id:'scout',name:'Éclaireur du quotidien',unlock:{type:'level',value:1}},
 {id:'wanderer',name:'Marcheur régulier',unlock:{type:'streak',value:3}},
 {id:'archivist',name:'Archiviste des traces',unlock:{type:'journal',value:15}},
 {id:'cartographer',name:'Cartographe des habitudes',unlock:{type:'regions',value:4}},
 {id:'keeper',name:'Gardien des traces',unlock:{type:'level',value:12}},
 {id:'ritualist',name:'Maître des expéditions',unlock:{type:'rituals',value:3}}
];

const CATEGORIES=[
 {id:'constance',name:'Constance',short:'Tenir',color:'#b56d52',icon:'flame.svg',region:'forest'},
 {id:'connaissance',name:'Connaissance',short:'Comprendre',color:'#6f86b9',icon:'book.svg',region:'library'},
 {id:'organisation',name:'Organisation',short:'Ordonner',color:'#9a949b',icon:'settings.svg',region:'city'},
 {id:'energie',name:'Énergie',short:'Bouger',color:'#d98a48',icon:'spark.svg',region:'mountain'},
 {id:'sante',name:'Santé',short:'Prendre soin',color:'#6da66b',icon:'health.svg',region:'garden'},
 {id:'repos',name:'Repos',short:'Récupérer',color:'#69789d',icon:'clock.svg',region:'sanctuary'}
];
const COMPANIONS=[
 {id:'fenn',name:'Fenn',title:'Renard de la Constance',rarity:'uncommon',favorite:'constance',affinity:38,level:3,unlock:{type:'start'},story:'Fenn collectionne les jours où tu as tenu parole à toi-même.',messages:['Une petite victoire. Je la range avec les autres.','On revient demain. La forêt aime la régularité.'],sprite:'assets/sprites/companions/fenn.svg',portrait:'assets/portraits/fenn.svg'},
 {id:'mira',name:'Mira',title:'Mage de la Connaissance',rarity:'rare',favorite:'connaissance',affinity:26,level:2,story:'Mira transforme chaque page comprise en étincelle.',messages:['Une page comprise vaut mieux que dix survolées.','La curiosité ouvre les portes les plus têtues.'],sprite:'assets/sprites/companions/mira.svg',portrait:'assets/portraits/mira.svg'},
 {id:'bolt',name:'Bolt',title:'Robot de l’Organisation',rarity:'common',favorite:'organisation',affinity:14,level:1,story:'Bolt adore les listes courtes et les dossiers qui ferment proprement.',messages:['Une chose à la fois. Ensuite, on range.','La routine est un système, pas une prison.'],sprite:'assets/sprites/companions/bolt.svg',portrait:'assets/portraits/bolt.svg'},
 {id:'raku',name:'Raku',title:'Dragon de l’Énergie',rarity:'epic',favorite:'energie',affinity:9,level:1,story:'Raku veut te voir bouger avant de te voir penser trop longtemps.',messages:['Debout. Une petite action suffit pour allumer le moteur.','Ça chauffe. Encore une !'],sprite:'assets/sprites/companions/raku.svg',portrait:'assets/portraits/raku.svg',unlock:{type:'level',value:4}},
 {id:'moss',name:'Moss',title:'Gardien de la Santé',rarity:'uncommon',favorite:'sante',affinity:12,level:1,story:'Moss protège les habitudes qui tiennent sur la durée.',messages:['Ton corps aime les petits gestes réguliers.','Doucement. Mais souvent.'],sprite:'assets/sprites/companions/moss.svg',portrait:'assets/portraits/moss.svg',unlock:{type:'category',category:'sante',count:3}},
 {id:'noct',name:'Noct',title:'Gardien du Repos',rarity:'rare',favorite:'repos',affinity:4,level:1,story:'Noct garde les nuits calmes et les pauses sans culpabilité.',messages:['Le repos n’est pas une fuite. C’est une étape.','Ferme les onglets. Garde de la place pour demain.'],sprite:'assets/sprites/companions/noct.svg',portrait:'assets/portraits/noct.svg',unlock:{type:'category-days',category:'repos',count:7}}
];
const NPCS=[
 {id:'mentor',name:'Ilya',role:'Mentor',portrait:'assets/portraits/mentor.svg',sprite:'assets/sprites/npcs/mentor.svg',message:'Tu n’as pas besoin d’une journée parfaite. Tu as besoin d’une journée où tu avances.'},
 {id:'archiviste',name:'Nox',role:'Archiviste',portrait:'assets/portraits/archiviste.svg',sprite:'assets/sprites/npcs/archiviste.svg',message:'Je conserve les traces. Même les petites. Elles racontent mieux une aventure que les grands discours.'},
 {id:'jardinier',name:'Sève',role:'Jardinière',portrait:'assets/portraits/jardinier.svg',sprite:'assets/sprites/npcs/jardinier.svg',message:'Une habitude est une graine. On ne la tire pas pour la faire pousser.'},
 {id:'forgeron',name:'Bran',role:'Forgeron',portrait:'assets/portraits/forgeron.svg',sprite:'assets/sprites/npcs/forgeron.svg',message:'Tu apportes l’effort. Je transforme les preuves en objets.'},
 {id:'cartographe',name:'Tess',role:'Cartographe',portrait:'assets/portraits/cartographe.svg',sprite:'assets/sprites/npcs/cartographe.svg',message:'Les chemins deviennent visibles après quelques pas. Pas avant.'},
 {id:'gardien',name:'Orin',role:'Stats',portrait:'assets/portraits/gardien.svg',sprite:'assets/sprites/npcs/gardien.svg',message:'Les chiffres ne jugent rien. Ils montrent où le sol glisse.'},
 {id:'marchand',name:'Pico',role:'Cosmétiques',portrait:'assets/portraits/marchand.svg',sprite:'assets/sprites/npcs/marchand.svg',message:'Pas de power-up. Seulement des choses qui rendent ton aventurier à toi.'},
 {id:'defis',name:'Varn',role:'Défis',portrait:'assets/portraits/defis.svg',sprite:'assets/sprites/npcs/defis.svg',message:'Je ne donne pas des montagnes. Je donne des marches.'},
 {id:'mystere',name:'Kheyl',role:'Fonctions futures',portrait:'assets/portraits/mystere.svg',sprite:'assets/sprites/npcs/mystere.svg',message:'Certaines cartes n’apparaissent qu’après avoir vécu quelques jours.'}
];
const REGIONS=[
 {id:'forest',name:'Forêt de la Constance',unlockLevel:1,desc:'Le premier territoire. La régularité y trace des sentiers.',bg:'assets/backgrounds/forest.svg',category:'constance'},
 {id:'library',name:'Bibliothèque de la Connaissance',unlockLevel:2,desc:'Les pages comprises y laissent des traces lumineuses.',bg:'assets/backgrounds/library.svg',category:'connaissance'},
 {id:'mountain',name:'Montagne de l’Effort',unlockLevel:4,desc:'Les tâches qui demandent du cran alimentent les ascensions.',bg:'assets/backgrounds/mountain.svg',category:'energie'},
 {id:'garden',name:'Jardin de la Santé',unlockLevel:6,desc:'Les petits gestes réguliers y font pousser le monde.',bg:'assets/backgrounds/garden.svg',category:'sante'},
 {id:'city',name:'Cité de l’Organisation',unlockLevel:8,desc:'L’ordre sert ici à libérer de l’espace mental.',bg:'assets/backgrounds/city.svg',category:'organisation'},
 {id:'sanctuary',name:'Sanctuaire du Repos',unlockLevel:10,desc:'Une région lente, dédiée au sommeil, aux pauses et aux limites.',bg:'assets/backgrounds/sanctuary.svg',category:'repos'},
 {id:'observatory',name:'Observatoire de l’Analyse',unlockLevel:12,desc:'Les tendances deviennent visibles sans prétendre lire l’avenir.',bg:'assets/backgrounds/observatory.svg',category:'connaissance'},
 {id:'horizon',name:'Horizon Inconnu',unlockLevel:16,desc:'Zone expérimentale où les systèmes futurs prennent racine.',bg:'assets/backgrounds/horizon.svg',category:'constance'}
];
const TREASURES=[
 {id:'tea',name:'Graine de thé',xp:10,coins:8,desc:'Une petite réserve pour demain.',asset:'assets/items/herb.svg'},
 {id:'shell',name:'Coquille ancienne',xp:14,coins:6,desc:'Trouvée au bord du chemin.',asset:'assets/items/feather.svg'},
 {id:'ember',name:'Braise douce',xp:12,coins:12,desc:'Elle tient dans la paume.',asset:'assets/items/crystal.svg'},
 {id:'ink',name:'Encre d’archive',xp:18,coins:5,desc:'Parfaite pour remplir une page.',asset:'assets/items/feather.svg'}
];
const REWARDS=[
 {id:'scarf-sun',name:'Écharpe du Matin',cost:60,kind:'cosmetic',rarity:'common',desc:'Un tissu chaud pour les débuts de journée.',asset:'assets/items/feather.svg',slot:'neck',visual:'scarf',visualAsset:'assets/cosmetics/scarf-sun.svg'},
 {id:'ring-fern',name:'Anneau de Fougère',cost:120,kind:'cosmetic',rarity:'uncommon',desc:'Petit symbole de constance.',asset:'assets/items/ring.svg',slot:'hand',visual:'band',visualAsset:'assets/cosmetics/ring-fern.svg'},
 {id:'crystal-mira',name:'Cristal de Mira',cost:180,kind:'cosmetic',rarity:'rare',desc:'Une étincelle d’exploration.',asset:'assets/items/crystal.svg',slot:'charm',visual:'charm',visualAsset:'assets/cosmetics/crystal-mira.svg'},
 {id:'herb-health',name:'Herbe de Sève',cost:240,kind:'cosmetic',rarity:'rare',desc:'Un talisman discret lié à la santé.',asset:'assets/items/herb.svg',slot:'charm',visual:'charm',visualAsset:'assets/cosmetics/herb-health.svg'},
 {id:'map-horizon',name:'Fragment de Carte',cost:320,kind:'unlock',rarity:'epic',desc:'Révèle une note secrète de la carte.',asset:'assets/items/map.svg',slot:'relic',visual:'relic',visualAsset:'assets/cosmetics/map-horizon.svg'},
 {id:'ember-clasp',name:'Fermoir Braise',cost:280,kind:'cosmetic',rarity:'epic',desc:'Une attache chaude qui souligne l’énergie.',asset:'assets/items/crystal.svg',slot:'neck',visual:'scarf',visualAsset:'assets/cosmetics/ember-clasp.svg'},
 {id:'leaf-charm',name:'Charme Feuille',cost:200,kind:'cosmetic',rarity:'uncommon',desc:'Un petit morceau de jardin porté près du cœur.',asset:'assets/items/herb.svg',slot:'charm',visual:'charm',visualAsset:'assets/cosmetics/leaf-charm.svg'},
 {id:'night-band',name:'Bracelet de Veille',cost:260,kind:'cosmetic',rarity:'rare',desc:'Une bande sombre pour les routines de repos.',asset:'assets/items/ring.svg',slot:'hand',visual:'band',visualAsset:'assets/cosmetics/night-band.svg'}
];
const ACHIEVEMENTS=[
 {id:'first',name:'Premier pas',desc:'Valider ta première quête.',rewardXp:20,rewardCoins:10,icon:'assets/achievements/first-step.svg'},
 {id:'streak3',name:'Petit feu',desc:'Atteindre 3 jours de série.',rewardXp:30,rewardCoins:15,icon:'assets/achievements/badge-1.svg'},
 {id:'streak7',name:'Le chemin tient',desc:'Atteindre 7 jours de série.',rewardXp:70,rewardCoins:30,icon:'assets/achievements/badge-2.svg'},
 {id:'collector',name:'Archiviste',desc:'Conserver 15 entrées dans le journal.',rewardXp:80,rewardCoins:50,icon:'assets/achievements/badge-3.svg'},
 {id:'mastery',name:'Rituel solide',desc:'Atteindre 80 % de maîtrise sur une habitude.',rewardXp:100,rewardCoins:60,icon:'assets/achievements/badge-4.svg'},
 {id:'explorer',name:'Cartographe',desc:'Déverrouiller 4 régions.',rewardXp:140,rewardCoins:90,icon:'assets/achievements/badge-5.svg'},
 {id:'ritual',name:'Chef d’expédition',desc:'Créer et exécuter 3 rituels.',rewardXp:120,rewardCoins:70,icon:'assets/achievements/badge-6.svg'}
];
const CHALLENGES=[
 {id:'pushups',title:'20 pompes',desc:'Fais 20 pompes, réparties comme tu veux.',category:'energie',difficulty:2,xp:30},
 {id:'pages',title:'Lire 10 pages',desc:'Lis 10 pages d’un livre ou d’un cours.',category:'connaissance',difficulty:1,xp:25},
 {id:'words',title:'Apprendre 5 mots',desc:'Apprends 5 mots d’une langue que tu travailles.',category:'connaissance',difficulty:2,xp:30},
 {id:'desk',title:'Nettoyer un coin',desc:'Choisis une petite zone et remets-la en ordre.',category:'organisation',difficulty:1,xp:20},
 {id:'walk',title:'Marcher 15 minutes',desc:'Sors marcher ou fais un aller-retour actif.',category:'sante',difficulty:1,xp:20},
 {id:'pause',title:'10 minutes sans écran',desc:'Mets le téléphone de côté et laisse le cerveau respirer.',category:'repos',difficulty:2,xp:25},
 {id:'journal',title:'Écrire 3 lignes',desc:'Écris trois lignes sur ta journée.',category:'constance',difficulty:1,xp:20}
];
const QUEST_DEFS=[
 {id:'qd-actions',period:'daily',name:'Trois traces',desc:'Valide trois actions ou le défi du jour.',target:3,xp:25,coins:10,kind:'dailyActions'},
 {id:'qw-constance',period:'weekly',name:'Atelier de constance',desc:'Accumule cinq validations cette semaine.',target:5,xp:80,coins:25,kind:'windowCompletions',window:7},
 {id:'qw-categories',period:'weekly',name:'Tour des territoires',desc:'Fais vivre au moins trois catégories cette semaine.',target:3,xp:100,coins:30,kind:'categories',window:7},
 {id:'qm-crossing',period:'monthly',name:'Grande traversée',desc:'Accumule vingt validations ce mois-ci.',target:20,xp:220,coins:70,kind:'windowCompletions',window:30},
 {id:'qs-lantern',period:'season',name:'Faire brûler la saison',desc:'Gagne de l’expérience réelle pendant la saison.',target:150,xp:180,coins:60,kind:'seasonXp'}
];
const SEASON_CONFIG={durationDays:30,cycleName:'Lanternes',archiveLimit:8,minimumTraceDays:5};
const SEASON_GOALS=[
 {id:'sg-seven',name:'Sept traces',desc:'Valider 7 habitudes pendant la saison.',target:7,xp:40,coins:20,kind:'seasonCompletions'},
 {id:'sg-four-challenges',name:'Quatre défis',desc:'Réussir 4 défis du jour pendant la saison.',target:4,xp:60,coins:30,kind:'seasonChallenges'},
 {id:'sg-two-rituals',name:'Deux expéditions',desc:'Exécuter 2 rituels pendant la saison.',target:2,xp:90,coins:45,kind:'seasonRituals'},
 {id:'sg-companion',name:'Lien vivant',desc:'Atteindre 60 points d’affinité cumulée sur un compagnon.',target:60,xp:80,coins:35,kind:'companionAffinity'},
 {id:'sg-master',name:'Maîtrise locale',desc:'Atteindre 80 % de maîtrise sur une habitude pendant la saison.',target:80,xp:120,coins:50,kind:'habitMastery'}
];
const SEED_HABITS=[
 {id:'h_read',title:'Lire 10 pages',desc:'Lecture libre ou cours technique.',category:'connaissance',difficulty:'medium',frequency:'daily',days:[0,1,2,3,4,5,6],targetTime:'20:30',xp:25,importance:3,duration:20,notes:'Toujours garder un marque-page à portée.',substeps:[{id:'s1',title:'Choisir le texte'},{id:'s2',title:'Lire sans notifications'}],color:'#6f86b9',icon:'book.svg',companionId:'mira',archived:false,startDate:null,endDate:null},
 {id:'h_push',title:'20 pompes',desc:'Deux séries de dix. Adapter si besoin.',category:'energie',difficulty:'medium',frequency:'specific',days:[1,3,5],targetTime:'07:30',xp:30,importance:3,duration:10,notes:'Rester propre sur la forme.',substeps:[{id:'s3',title:'Installer un espace libre'},{id:'s4',title:'Faire 2 séries de 10'}],color:'#d98a48',icon:'spark.svg',companionId:'raku',archived:false,startDate:null,endDate:null},
 {id:'h_words',title:'5 mots anglais',desc:'Apprendre 5 mots et les employer dans une phrase.',category:'connaissance',difficulty:'easy',frequency:'weekdays',days:[1,2,3,4,5],targetTime:'18:00',xp:20,importance:2,duration:10,notes:'Noter les phrases utiles.',substeps:[{id:'s5',title:'Choisir 5 mots'},{id:'s6',title:'Créer une phrase'}],color:'#6f86b9',icon:'book.svg',companionId:'mira',archived:false,startDate:null,endDate:null},
 {id:'h_tidy',title:'Ranger le bureau',desc:'5 minutes chrono.',category:'organisation',difficulty:'easy',frequency:'daily',days:[0,1,2,3,4,5,6],targetTime:'19:00',xp:15,importance:1,duration:5,notes:'Commencer par le plus visible.',substeps:[{id:'s7',title:'Jeter le superflu'},{id:'s8',title:'Ranger la surface'}],color:'#9a949b',icon:'settings.svg',companionId:'bolt',archived:false,startDate:null,endDate:null},
 {id:'h_sleep',title:'Préparer le sommeil',desc:'Couper les écrans 20 minutes avant de dormir.',category:'repos',difficulty:'medium',frequency:'daily',days:[0,1,2,3,4,5,6],targetTime:'22:30',xp:25,importance:3,duration:20,notes:'Baisser les lumières.',substeps:[{id:'s9',title:'Couper les écrans'},{id:'s10',title:'Préparer le lit'}],color:'#69789d',icon:'clock.svg',companionId:'noct',archived:false,startDate:null,endDate:null}
];


// === js/models/schema.js ===
const STORE_DEFS={
  meta:{keyPath:'id'},
  profile:{keyPath:'id'},
  habits:{keyPath:'id'},
  completions:{keyPath:'id'},
  substeps:{keyPath:'id'},
  challenges:{keyPath:'id'},
  quests:{keyPath:'id'},
  companions:{keyPath:'id'},
  journal:{keyPath:'id'},
  labs:{keyPath:'id'},
  rituals:{keyPath:'id'},
  ritualRuns:{keyPath:'id'},
  rewards:{keyPath:'id'},
  inventory:{keyPath:'id'},
  campaign:{keyPath:'id'},
  achievements:{keyPath:'id'},
  events:{keyPath:'id'},
  seasons:{keyPath:'id'},
  settings:{keyPath:'id'},
  eventEvidence:{keyPath:'id'},
  seasonRuns:{keyPath:'id'},
  labObservations:{keyPath:'id'},
  rewardXp:{keyPath:'id'},
};
const STORE_NAMES=Object.keys(STORE_DEFS);
const SCHEMA_REQUIRED_ARRAYS=['habits','completions','substepCompletions','challengeCompletions','questRuns','companions','journal','labs','rituals','ritualCompletions','inventory'];
const SCHEMA_FREQUENCIES=new Set(['daily','weekdays','weekends','weekly','specific']);
const SCHEMA_DIFFICULTIES=new Set(['easy','medium','hard']);
const SCHEMA_SOURCES=new Set(['habit','ritual','challenge']);
const SCHEMA_COMPANION_APPEARANCES=new Set(['base','focus','happy','surprise']);
function companionTierFromAffinity(value){const n=Math.max(0,Number(value)||0);return n>=250?3:n>=100?2:1}

// === js/utils/core.js ===
let state=null;
let storageMode='indexeddb';
let toastTimer=null;

function uid(prefix){return `${prefix}_${Math.random().toString(36).slice(2,9)}_${Date.now().toString(36)}`}
function isoDay(date=new Date()){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function today(){return isoDay()}
function parseDay(s){const raw=String(s??'');if(!/^\d{4}-\d{2}-\d{2}$/.test(raw))return new Date(NaN);return new Date(`${raw}T12:00:00`)}
function dayOffset(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-Number(n||0));return isoDay(d)}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function fmtDate(s){const d=parseDay(s);return Number.isNaN(d.getTime())?'Date inconnue':new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short'}).format(d)}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function cat(id){return CATEGORIES.find(c=>c.id===id)||CATEGORIES[0]}
function diffXp(d){return ({easy:15,medium:25,hard:40}[d]||20)}
function xpForNext(level){return 100+(level-1)*50}
function levelFromXp(xp){let level=1,remain=Math.max(0,Number(xp)||0);while(remain>=xpForNext(level)){remain-=xpForNext(level);level++}return {level,into:remain,next:xpForNext(level)}}
function activeHabits(){return state.habits.filter(h=>!h.archived)}
function weekday(date=today()){return parseDay(date).getDay()}
function scheduled(h,date=today()){
  if(!h||h.archived)return false;
  if(h.startDate&&date<h.startDate)return false;
  if(h.endDate&&date>h.endDate)return false;
  const wd=weekday(date);
  if(h.frequency==='daily')return true;
  if(h.frequency==='weekdays')return wd>=1&&wd<=5;
  if(h.frequency==='weekends')return wd===0||wd===6;
  if(h.frequency==='weekly')return (h.days||[]).includes(wd);
  if(h.frequency==='specific')return (h.days||[]).includes(wd);
  return true;
}
function completion(hid,date=today()){return state.completions.find(c=>c.habitId===hid&&c.date===date)}
function completedCount(hid,days=30){let n=0;for(let i=0;i<days;i++)if(completion(hid,dayOffset(i)))n++;return n}
function mastery(h){const eligible=[];for(let i=0;i<30;i++){const d=dayOffset(i);if(scheduled(h,d))eligible.push(d)}if(!eligible.length)return 0;return Math.round(eligible.filter(d=>completion(h.id,d)).length/eligible.length*100)}
function habitStreak(id){let n=0;for(let i=0;i<365;i++){if(completion(id,dayOffset(i)))n++;else{if(i===0)break;return n}}return n}
function streak(){let n=0;for(let i=0;i<365;i++){const d=dayOffset(i);const any=state.completions.some(c=>c.date===d)||state.challengeCompletions.some(c=>c.date===d)||state.ritualCompletions.some(c=>c.date===d);if(any)n++;else{if(i===0)break;return n}}return n}
function bestStreak(){let best=0,cur=0,last=null;const dates=[...new Set([...state.completions,...state.challengeCompletions,...state.ritualCompletions].map(c=>c.date))].sort();for(const d of dates){if(last){const gap=(parseDay(d)-parseDay(last))/DAY_MS;cur=gap===1?cur+1:1}else cur=1;best=Math.max(best,cur);last=d}return best}
function recentDays(n){return Array.from({length:n},(_,i)=>dayOffset(n-1-i))}
function totalXp(){return Number(state?.profile?.xp||0)}
function journalEntry(type,title,body){state.journal.unshift({id:uid('j'),date:today(),type,title,body});state.journal=state.journal.slice(0,180)}
function momentBucket(t){if(!t)return 'Sans horaire';const h=Number(String(t).split(':')[0]||0);if(h<6)return 'Nuit';if(h<12)return 'Matin';if(h<18)return 'Après-midi';return 'Soir'}
function daysBetween(a,b){return Math.round((parseDay(b)-parseDay(a))/DAY_MS)}
function unique(arr){return [...new Set(arr)]}
function inRange(date,start,end=today()){return Boolean(date&&(!start||date>=start)&&(!end||date<=end))}
function actionCountForDate(date){return state.completions.filter(c=>c.date===date).length+state.challengeCompletions.filter(c=>c.date===date).length+state.ritualCompletions.filter(c=>c.date===date).length}

function uniqueDatesBetween(days=30,habitIds=null){const limit=Math.max(1,Number(days)||30),ids=Array.isArray(habitIds)?new Set(habitIds):null;const dates=[];for(let i=0;i<limit;i++){const d=dayOffset(i);if(state.completions.some(c=>c.date===d&&(!ids||ids.has(c.habitId))))dates.push(d)}return unique(dates).length}

function showToast(title,body=''){const root=document.getElementById('toast-root');if(!root)return;clearTimeout(toastTimer);root.innerHTML=`<div class="toast" role="status"><strong>${esc(title)}</strong><span>${esc(body)}</span></div>`;toastTimer=setTimeout(()=>{root.innerHTML=''},3600)}

// === js/state/store.js ===
function seededState(){
  const t=today();
  const completions=[];
  for(const h of SEED_HABITS){for(let i=1;i<=6;i++){if((h.id.charCodeAt(2)+i)%3===0)completions.push({id:`demo_${h.id}_${i}`,habitId:h.id,date:dayOffset(i),xp:h.xp,category:h.category})}}
  return {
    schemaVersion:SCHEMA_VERSION,
    meta:{id:'main',demo:true,createdAt:t,lastMigration:SCHEMA_VERSION},
    profile:{id:'profile-1',name:'Nova',title:'Éclaireur du quotidien',archetype:'Éclaireur',bio:'Un aventurier qui transforme les petites actions en terrain parcouru.',xp:265,coins:95,avatar:'assets/sprites/player/custom/short-traveler-amber.svg',activeCompanionId:'fenn',appearance:{hair:'short',outfit:'traveler',accent:'amber'},equipped:{neck:null,hand:null,charm:null,relic:null},unlockedTitles:['scout'],contextPhrases:['Petite victoire, vraie progression.','Le chemin se dessine après quelques pas.']},
    habits:SEED_HABITS.map(h=>({...h,days:[...(h.days||[])],substeps:(h.substeps||[]).map(s=>({...s}))})),
    completions,
    substepCompletions:[],
    challengeCompletions:[],
    questRuns:[],
    companions:COMPANIONS.map(c=>({...c,unlocked:c.unlock?.type==='start',affinity:Number(c.affinity||0),totalAffinity:Number(c.affinity||0),level:Math.max(1,Number(c.level||1)),evolutionTier:1,appearances:['base'],activeAppearance:'base'})),
    journal:[
      {id:uid('j'),date:dayOffset(1),type:'win',title:'Une soirée bien rangée',body:'Le bureau est revenu à sa place. Petit geste, vraie différence.'},
      {id:uid('j'),date:dayOffset(3),type:'streak',title:'Le feu tient',body:'Trois jours propres sur la lecture.'}
    ],
    labs:[{id:uid('lab'),name:'Routine de démarrage',hypothesis:'Une entrée de journée plus courte réduit la friction.',criterion:'Obtenir au moins 3 traces sur la fenêtre observée.',habitIds:['h_push','h_words'],duration:7,startedAt:dayOffset(4),status:'active',baseline:null,observations:[],measurements:[]}],
    rituals:[{id:'rit_morning',name:'Rituel de démarrage',description:'Une expédition courte pour lancer la journée.',habitIds:['h_push','h_words'],bonusXp:35,createdAt:t,archived:false}],
    ritualCompletions:[],
    game:{
      unlockedRegions:['forest','library','mountain'],
      claimedRewards:[],completedAchievements:['first','streak3'],
      rewardXp:[],
      claimedSeasonGoals:[],claimedDailyTreasures:[],dailyTreasureVersion:1,
      settings:{selectedTheme:'night',highContrast:false,reducedMotion:false,sound:false,volume:0.75},
      season:{id:'season-1',name:'Saison des Premières Lanternes',day:12,total:30,startDate:dayOffset(11),durationDays:SEASON_CONFIG.durationDays,claimedGoals:[],history:[],stats:{completed:0,xp:0},startAffinity:{}},
      event:{id:'lantern-trace',startDate:dayOffset(4),progress:0,target:5,claimed:false,reward:{xp:60,coins:50},lanterns:[],evidence:[],lastTraceDate:null,lastSource:null},
      campaign:{currentRegion:'forest',exploredRegions:['forest'],chapter:1}
    },
    inventory:[]
  };
}
function normalizeHabit(h){return Object.assign({frequency:'daily',days:[0,1,2,3,4,5,6],importance:2,duration:10,archived:false,startDate:null,endDate:null,createdAt:today(),substeps:[],color:cat(h?.category).color,icon:cat(h?.category).icon,xp:diffXp(h?.difficulty||'medium'),notes:'',companionId:null,title:'Nouvelle quête',desc:'',targetTime:'',xpBonus:0},h||{})}
function migrateV1toV2(s){s=s||{};s.challengeCompletions??=[];s.questRuns??=[];return s}
function migrateV2toV3(s){s=s||{};s.inventory??=[];s.rituals??=[];s.ritualCompletions??=[];return s}
function migrateV3toV4(s){s=s||{};s.game??={};s.game.season??={};s.game.event??={};s.game.claimedDailyTreasures??=[];s.game.claimedSeasonGoals??=[];return s}
function migrateV4toV5(s){s=s||{};s.game??={};s.game.event=Object.assign({id:'lantern-trace',progress:0,target:5,claimed:false,reward:{xp:60,coins:50},lanterns:[],evidence:[],lastTraceDate:null},s.game.event||{});s.game.season=Object.assign({id:'season-1',name:'Saison des Lanternes 1',day:1,total:30,startDate:today(),durationDays:30,claimedGoals:[],history:[],stats:{completed:0,xp:0}},s.game.season||{});s.profile??={};s.profile.appearance=Object.assign({hair:'short',outfit:'traveler',accent:'amber'},s.profile.appearance||{});s.profile.equipped=Object.assign({neck:null,hand:null,charm:null,relic:null},s.profile.equipped||{});s.profile.unlockedTitles=Array.isArray(s.profile.unlockedTitles)?s.profile.unlockedTitles:['scout'];for(const l of s.labs||[])l.observations=Array.isArray(l.observations)?l.observations:[];return s}
function migrateV5toV6(s){s=s||{};s.game??={};s.game.rewardXp=Array.isArray(s.game.rewardXp)?s.game.rewardXp:[];s.game.event=Object.assign({target:5,reward:{xp:60,coins:50},evidence:[]},s.game.event||{});s.game.event.evidence=Array.isArray(s.game.event.evidence)?s.game.event.evidence:[];s.game.season=Object.assign({history:[],stats:{completed:0,xp:0}},s.game.season||{});s.game.campaign=Object.assign({currentRegion:'forest',exploredRegions:['forest'],chapter:1},s.game.campaign||{});s.rituals=(s.rituals||[]).map(r=>Object.assign({description:'',archived:false,createdAt:today()},r));for(const l of s.labs||[])Object.assign(l,{hypothesis:l.hypothesis||'',criterion:l.criterion||'',observations:Array.isArray(l.observations)?l.observations:[],measurements:Array.isArray(l.measurements)?l.measurements:[]});return s}
function migrateV7toV8(s){s=s||{};s.game??={};s.game.rewardXp=Array.isArray(s.game.rewardXp)?s.game.rewardXp:[];return s}
function migrateV6toV7(s){s=s||{};s.game??={};s.game.event=Object.assign({startDate:today(),lastSource:null},s.game.event||{});s.game.season=Object.assign({startAffinity:{}},s.game.season||{});s.game.season.startAffinity=Object.assign({},s.game.season.startAffinity||{});s.game.rewardXp=Array.isArray(s.game.rewardXp)?s.game.rewardXp:[];for(const c of s.completions||[])c.rewardRef=c.rewardRef||null;for(const q of s.questRuns||[])q.claimedAt=q.claimedAt||null;return s}
const MIGRATIONS={1:migrateV1toV2,2:migrateV2toV3,3:migrateV3toV4,4:migrateV4toV5,5:migrateV5toV6,6:migrateV6toV7,7:migrateV7toV8};
function migrateState(raw){
  let s=raw?.data&&raw.exportVersion?raw.data:raw;
  if(!s||typeof s!=='object')return null;
  let current=Number(s.schemaVersion||1);
  if(!Number.isInteger(current)||current<1)return null;
  if(current>SCHEMA_VERSION)return null;
  for(let v=current;v<SCHEMA_VERSION;v++)s=(MIGRATIONS[v]||((x)=>x))(s);
  const seed=seededState();
  s=Object.assign(seed,s);
  s.meta=Object.assign(seed.meta,s.meta||{});s.profile=Object.assign(seed.profile,s.profile||{});s.game=Object.assign(seed.game,s.game||{});
  s.game.settings=Object.assign(seed.game.settings,s.game.settings||{});s.game.event=Object.assign(seed.game.event,s.game.event||{});s.game.season=Object.assign(seed.game.season,s.game.season||{});s.game.campaign=Object.assign(seed.game.campaign,s.game.campaign||{});
  s.game.event=Object.assign(seed.game.event,s.game.event||{});s.game.event.reward=Object.assign(seed.game.event.reward,s.game.event.reward||{});s.game.event.startDate=s.game.event.startDate||seed.game.event.startDate;s.game.event.target=Number(s.game.event.target||5);s.game.event.progress=Math.min(s.game.event.target,Math.max(0,Number(s.game.event.progress||0)));s.game.event.lanterns=unique(s.game.event.lanterns||[]).sort();s.game.event.evidence=unique(s.game.event.evidence||s.game.event.lanterns||[]).sort();s.game.event.lastTraceDate=s.game.event.evidence.at(-1)||null;s.game.event.lastSource=s.game.event.lastSource||null;
  s.game.rewardXp=(Array.isArray(s.game.rewardXp)?s.game.rewardXp:[]).filter(Boolean).map(x=>Object.assign({},x,{amount:Math.max(0,Number(x.amount)||0),coins:Math.max(0,Number.isFinite(Number(x.coins))?Number(x.coins):Math.max(1,Math.round((Number(x.amount)||0)/5))),source:String(x.source||'action'),date:x.date||today(),id:String(x.id||uid('rxp'))}));s.game.claimedRewards=unique(s.game.claimedRewards||[]);s.game.completedAchievements=unique(s.game.completedAchievements||[]);s.game.unlockedRegions=unique(s.game.unlockedRegions||[]);s.game.claimedSeasonGoals=unique(s.game.claimedSeasonGoals||[]);s.game.claimedDailyTreasures=unique(s.game.claimedDailyTreasures||[]);
  s.inventory=unique(Array.isArray(s.inventory)?s.inventory:[]);
  s.profile.appearance=Object.assign(seed.profile.appearance,s.profile.appearance||{});s.profile.appearance.hair=APPEARANCE_OPTIONS.hair.some(x=>x.id===s.profile.appearance.hair)?s.profile.appearance.hair:seed.profile.appearance.hair;s.profile.appearance.outfit=APPEARANCE_OPTIONS.outfit.some(x=>x.id===s.profile.appearance.outfit)?s.profile.appearance.outfit:seed.profile.appearance.outfit;s.profile.appearance.accent=APPEARANCE_OPTIONS.accent.some(x=>x.id===s.profile.appearance.accent)?s.profile.appearance.accent:seed.profile.appearance.accent;s.profile.equipped=Object.assign(seed.profile.equipped,s.profile.equipped||{});s.profile.unlockedTitles=unique(Array.isArray(s.profile.unlockedTitles)?s.profile.unlockedTitles:['scout']);
  s.profile.avatar=s.profile.avatar||'assets/sprites/player/custom/short-traveler-amber.svg';
  s.habits=(Array.isArray(s.habits)?s.habits:[]).map(normalizeHabit);
  for(const key of ['completions','substepCompletions','challengeCompletions','questRuns','companions','journal','labs','rituals','ritualCompletions'])if(!Array.isArray(s[key]))s[key]=[];
  s.questRuns=s.questRuns.map(q=>Object.assign({progress:0,target:0,ready:false,claimed:false,claimedAt:null,createdAt:q?.createdAt||today()},q||{}));
  s.companions=(s.companions.length?s.companions:COMPANIONS).map(c=>{const base=COMPANIONS.find(x=>x.id===c.id)||c,merged=Object.assign({},base,c);merged.totalAffinity=Number(merged.totalAffinity??merged.affinity??0);merged.evolutionTier=companionTierFromAffinity(merged.totalAffinity);merged.level=Math.min(20,Math.max(1,1+Math.floor(merged.totalAffinity/25)));merged.affinity=merged.totalAffinity%100;merged.appearances=unique(Array.isArray(merged.appearances)?merged.appearances:['base']);if(merged.evolutionTier>=2&&!merged.appearances.includes('focus'))merged.appearances.push('focus');if(merged.evolutionTier>=3&&!merged.appearances.includes('happy'))merged.appearances.push('happy');if(merged.evolutionTier>=3&&!merged.appearances.includes('surprise'))merged.appearances.push('surprise');merged.appearances=unique(merged.appearances.filter(a=>SCHEMA_COMPANION_APPEARANCES.has(a)));merged.activeAppearance=merged.appearances.includes(merged.activeAppearance)?merged.activeAppearance:'base';return merged});
  s.rituals=s.rituals.map(r=>Object.assign({archived:false,description:'',createdAt:today()},r));
  s.labs=s.labs.map(l=>Object.assign({hypothesis:'',criterion:'',observations:[],measurements:[]},l));
  s.game.season.history=Array.isArray(s.game.season.history)?s.game.season.history:[];s.game.season.stats=Object.assign({completed:0,xp:0},s.game.season.stats||{});s.game.season.startAffinity=Object.assign({},s.game.season.startAffinity||{});s.game.rewardXp=Array.isArray(s.game.rewardXp)?s.game.rewardXp:[];
  s.schemaVersion=SCHEMA_VERSION;s.meta.lastMigration=SCHEMA_VERSION;
  return s;
}
function mergeSeed(s){return migrateState(s)||seededState()}

// === js/storage/db.js ===
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

// === js/components/ui.js ===
/* Shared UI helpers are intentionally kept tiny; view-specific rendering lives in views.js. */
function iconPath(name){return `assets/icons/${String(name||'spark.svg').replace(/^.*[\\/]/,'')}`}
function safeText(value,fallback=''){return String(value??fallback)}

// === js/systems/gamification.js ===
function hashString(s){let h=2166136261;
for(let i=0;
i<s.length;
i++){h^=s.charCodeAt(i);
h=Math.imul(h,16777619)}return h>>>0}
function currentStreakText(){const n=streak();
return n===1?'1 jour de série':`${n} jours de série`}
function dailyChallenge(){const eligible=CHALLENGES.filter(ch=>activeHabits().some(h=>h.category===ch.category));
const pool=eligible.length?eligible:CHALLENGES;
const idx=hashString(today())%pool.length,base=pool[idx];
return {...base,completed:state.challengeCompletions.some(c=>c.date===today()&&c.challengeId===base.id)}}
function periodStart(period){const d=parseDay(today());
if(period==='daily')return today();
if(period==='weekly'){const monday=(d.getDay()+6)%7;
d.setDate(d.getDate()-monday);
return isoDay(d)}if(period==='monthly')return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
return state.game.season.startDate||today()}
function periodEnd(period){const start=parseDay(periodStart(period));
if(period==='daily')return periodStart(period);
if(period==='weekly'){start.setDate(start.getDate()+6);
return isoDay(start)}if(period==='monthly'){start.setMonth(start.getMonth()+1);
start.setDate(0);
return isoDay(start)}const d=parseDay(periodStart('season'));
d.setDate(d.getDate()+Number(state.game.season.durationDays||SEASON_CONFIG.durationDays)-1);
return isoDay(d)}
function questKey(def){return `${def.id}:${periodStart(def.period)}`}
function betweenCount(items,start,end,field='date'){return items.filter(x=>inRange(x[field],start,end)).length}
function uniqueDates(items,start,end){return unique(items.map(x=>x.date).filter(d=>inRange(d,start,end))).length}
function categoriesBetween(items,start,end){return new Set(items.filter(x=>inRange(x.date,start,end)).map(x=>x.category)).size}
function seasonEntries(){const start=state.game.season.startDate||today(),end=periodEnd('season');
return {completions:state.completions.filter(c=>inRange(c.date,start,end)),challenges:state.challengeCompletions.filter(c=>inRange(c.date,start,end)),rituals:state.ritualCompletions.filter(c=>inRange(c.date,start,end))}}
function seasonXp(){const e=seasonEntries();
const legacyActions=e.completions.filter(x=>x.source!=='ritual').reduce((n,x)=>n+Number(x.xp||0),0)+e.challenges.reduce((n,x)=>n+Number(x.xp||0),0)+e.rituals.reduce((n,x)=>n+Number(x.xp||0),0);
const extra=(state.game.rewardXp||[]).filter(x=>inRange(x.date,e.start,e.end)&&!/^Habitude validée\.|^Défi du jour terminé\.|^Rituel exécuté\./.test(x.source||'')).reduce((n,x)=>n+Number(x.amount||0),0);
return legacyActions+extra}
function questProgress(def,run){const start=run?.start||periodStart(def.period),end=run?.end||periodEnd(def.period);
if(def.kind==='dailyActions')return state.completions.filter(c=>c.date===start&&c.source!=='ritual').length+state.challengeCompletions.filter(c=>c.date===start).length+state.ritualCompletions.filter(c=>c.date===start).length;
if(def.kind==='windowCompletions')return betweenCount(state.completions,start,end);
if(def.kind==='uniqueDays')return uniqueDates(state.completions,start,end);
if(def.kind==='categories')return categoriesBetween(state.completions,start,end);
if(def.kind==='seasonXp')return seasonXp();
if(def.kind==='seasonUniqueDays'){const e=seasonEntries();
return unique([...e.completions,...e.challenges,...e.rituals].map(x=>x.date)).length}if(def.kind==='seasonMastery')return state.habits.reduce((m,h)=>Math.max(m,mastery(h)),0);
return 0}
function refreshQuestLedger(){ensureQuestRuns(false);
for(const def of QUEST_DEFS){const run=state.questRuns.find(q=>q.key===questKey(def));
if(!run)continue;
run.target=def.target;
run.progress=Math.min(def.target,questProgress(def,run));
run.ready=run.progress>=def.target;
run.updatedAt=new Date().toISOString()}}
function ensureQuestRuns(refresh=true){const now=new Date().toISOString();
for(const def of QUEST_DEFS){const key=questKey(def);
if(!state.questRuns.some(q=>q.key===key))state.questRuns.push({id:uid('qr'),key,defId:def.id,period:def.period,start:periodStart(def.period),end:periodEnd(def.period),target:def.target,progress:0,ready:false,claimed:false,claimedAt:null,createdAt:now,updatedAt:now})}if(refresh)refreshQuestLedger()}
function getQuestRun(def){ensureQuestRuns();
return state.questRuns.find(q=>q.key===questKey(def))}
function maxCompanionAffinity(){return Math.max(0,...state.companions.map(c=>Number(c.totalAffinity||0)))}
function seasonGoalProgress(goal){const e=seasonEntries();
if(goal.kind==='seasonCompletions')return e.completions.length;
if(goal.kind==='seasonChallenges')return e.challenges.length;
if(goal.kind==='seasonRituals')return e.rituals.length;
if(goal.kind==='companionAffinity')return Math.max(0,...state.companions.map(c=>Math.max(0,Number(c.totalAffinity||0)-Number(state.game.season.startAffinity?.[c.id]||0))));
if(goal.kind==='habitMastery')return state.habits.reduce((m,h)=>Math.max(m,mastery(h)),0);
return 0}
function seasonSync(){const se=state.game.season;
const start=parseDay(se.startDate||today());
const age=Math.floor((parseDay(today())-start)/DAY_MS);
const duration=Number(se.durationDays||SEASON_CONFIG.durationDays);
if(age>=duration){se.history.unshift({id:se.id,name:se.name,startDate:se.startDate,endDate:isoDay(new Date(start.getTime()+(duration-1)*DAY_MS)),stats:{...(se.stats||{})},startAffinity:{...(se.startAffinity||{})}});
se.history=se.history.slice(0,SEASON_CONFIG.archiveLimit);
const next=Number((String(se.id).match(/(\d+)$/)||[0,1])[1])+1;
se.id=`season-${next}`;
se.name=`Saison des ${SEASON_CONFIG.cycleName} ${next}`;
se.startDate=today();
se.durationDays=duration;
se.day=1;
se.claimedGoals=[];
se.stats={completed:0,xp:0};
se.startAffinity=Object.fromEntries(state.companions.map(c=>[c.id,Number(c.totalAffinity||0)]));
state.game.claimedSeasonGoals=[];
state.questRuns=state.questRuns.filter(q=>q.period!=='season')}else{se.day=age+1;
if(!se.startAffinity||!Object.keys(se.startAffinity).length)se.startAffinity=Object.fromEntries(state.companions.map(c=>[c.id,Number(c.totalAffinity||0)]))}const e=seasonEntries();
se.stats.completed=e.completions.length+e.challenges.length+e.rituals.length;
se.stats.xp=seasonXp()}
function syncEventTrail(){const start=state.game.event.startDate||today();
const dates=unique([...state.completions,...state.challengeCompletions,...state.ritualCompletions].map(c=>c.date).filter(d=>d>=start&&d<=today())).sort();
state.game.event.evidence=dates;
state.game.event.lanterns=dates.slice(-state.game.event.target);
state.game.event.progress=Math.min(state.game.event.target,state.game.event.lanterns.length);
state.game.event.lastTraceDate=state.game.event.lanterns.at(-1)||null}
function recordEventTrace(source){syncEventTrail();
state.game.event.lastSource=source}
function maxTierAffinity(t){return companionTierFromAffinity(t)}
function companionNextThreshold(comp){return comp.evolutionTier>=3?250:comp.evolutionTier===2?250:100}
function addCompanionAffinity(comp,amount,reason){if(!comp?.unlocked)return;
const before=Number(comp.totalAffinity||0);
comp.totalAffinity=Math.min(999, before+Math.max(0,Number(amount)||0));
const oldTier=Number(comp.evolutionTier||1);
comp.evolutionTier=maxTierAffinity(comp.totalAffinity);
comp.level=Math.min(20,1+Math.floor(comp.totalAffinity/25));
comp.affinity=comp.totalAffinity%100;
comp.appearances=unique(Array.isArray(comp.appearances)?comp.appearances:['base']);
if(comp.evolutionTier>=2&&!comp.appearances.includes('focus'))comp.appearances.push('focus');
if(comp.evolutionTier>=3&&!comp.appearances.includes('happy'))comp.appearances.push('happy');
if(comp.evolutionTier>=3&&!comp.appearances.includes('surprise'))comp.appearances.push('surprise');
if(oldTier<comp.evolutionTier){journalEntry('companion',`${comp.name} évolue.`,`Palier ${comp.evolutionTier}/3 atteint${reason?` grâce à ${reason}`:''}.`);
showToast('Compagnon évolué',`${comp.name} · palier ${comp.evolutionTier}`)}}
function unlockCompanions(){const counts={};
for(const c of state.completions){counts[c.category]=(counts[c.category]||0)+1}for(const c of state.companions){c.totalAffinity=Number(c.totalAffinity??c.affinity??0);
c.evolutionTier=maxTierAffinity(c.totalAffinity);
c.level=Math.min(20,1+Math.floor(c.totalAffinity/25));
c.affinity=c.totalAffinity%100;
c.appearances=unique(Array.isArray(c.appearances)?c.appearances:['base']);
if(c.evolutionTier>=2&&!c.appearances.includes('focus'))c.appearances.push('focus');
if(c.evolutionTier>=3&&!c.appearances.includes('happy'))c.appearances.push('happy');
if(c.evolutionTier>=3&&!c.appearances.includes('surprise'))c.appearances.push('surprise');
if(!c.activeAppearance||!c.appearances.includes(c.activeAppearance))c.activeAppearance='base';
if(!c.unlock)continue;
let unlock=false;
if(c.unlock.type==='start')unlock=true;
if(c.unlock.type==='level')unlock=levelFromXp(state.profile.xp).level>=c.unlock.value;
if(c.unlock.type==='category')unlock=(counts[c.unlock.category]||0)>=c.unlock.count;
if(c.unlock.type==='category-days')unlock=new Set(state.completions.filter(x=>x.category===c.unlock.category).map(x=>x.date)).size>=c.unlock.count;
if(unlock&&!c.unlocked){c.unlocked=true;
journalEntry('companion',`${c.name} rejoint le camp.`,c.story||'Une nouvelle présence accompagne le parcours.');
showToast('Compagnon débloqué',c.name)}}}
function companionMessage(c){if(!c)return'Le chemin commence par une petite trace.';
const fav=state.completions.filter(x=>x.category===c.favorite).length;
const options=c.messages||['On continue.'];
if(c.evolutionTier>=3&&streak()>=5)return`${c.name} connaît maintenant ton rythme. Garde une marche simple aujourd’hui.`;
if(fav>0&&fav%5===0)return`${c.name} voit ${fav} traces dans son territoire favori.`;
return options[(fav+state.journal.length)%options.length]||options[0]}
const GAME_SAFE_COMPANION_IDS=new Set(['bolt','fenn','mira','moss','noct','raku']);
 const GAME_SAFE_COMPANION_APPEARANCES=new Set(['base','focus','happy','surprise']);
 function companionAppearanceAsset(c){const id=GAME_SAFE_COMPANION_IDS.has(c?.id)?c.id:'fenn';
const appearance=GAME_SAFE_COMPANION_APPEARANCES.has(c?.activeAppearance)?c.activeAppearance:'base';
return `assets/sprites/companions/evolution/${id}-${appearance}.svg`}
function unlockRegions(){const lvl=levelFromXp(state.profile.xp).level;
for(const r of REGIONS)if(lvl>=r.unlockLevel&&!state.game.unlockedRegions.includes(r.id))state.game.unlockedRegions.push(r.id)}
function checkTitles(){const conditions={wanderer:streak()>=3,archivist:state.journal.length>=15,cartographer:state.game.unlockedRegions.length>=4,keeper:levelFromXp(state.profile.xp).level>=12,ritualist:state.ritualCompletions.length>=3};
for(const [id,ok] of Object.entries(conditions))if(ok&&!state.profile.unlockedTitles.includes(id))state.profile.unlockedTitles.push(id)}
function achievements({reconcile=false}={}){const done=new Set(state.game.completedAchievements||[]);
const checks={first:state.completions.length+state.challengeCompletions.length+state.ritualCompletions.length>0,streak3:streak()>=3,streak7:streak()>=7,collector:state.journal.length>=15,mastery:state.habits.some(h=>mastery(h)>=80),explorer:state.game.unlockedRegions.length>=4,ritual:state.ritualCompletions.length>=3};
for(const a of ACHIEVEMENTS){const ok=Boolean(checks[a.id]);
if(ok&&!done.has(a.id)){done.add(a.id);
state.profile.xp+=a.rewardXp;
state.profile.coins+=a.rewardCoins;
state.game.rewardXp.push({id:uid('rxp'),amount:a.rewardXp,coins:a.rewardCoins,source:`achievement:${a.id}`,date:today()});
journalEntry('achievement',a.name,`${a.desc} Récompense : +${a.rewardXp} XP et ${a.rewardCoins} pièces.`);
showToast('Nouveau succès',`${a.name} · +${a.rewardXp} XP`)}else if(reconcile&&!ok&&done.has(a.id)){const reward=state.game.rewardXp.find(x=>x.source===`achievement:${a.id}`);
if(reward){const xp=Number(reward.amount)||0;
const coins=Number(reward.coins)||0;
state.profile.xp=Math.max(0,state.profile.xp-xp);
state.profile.coins=Math.max(0,state.profile.coins-coins);
state.game.rewardXp=state.game.rewardXp.filter(x=>x!==reward);
done.delete(a.id);
journalEntry('achievement',`${a.name} annulé`,`${a.desc} La condition n’est plus vraie ; la récompense a été retirée.`)}}}state.game.completedAchievements=[...done];
checkTitles();
unlockCompanions();
unlockRegions()}
function addXp(amount,source){const value=Math.max(0,Number(amount)||0),before=levelFromXp(state.profile.xp);
const coinsDelta=Math.max(1,Math.round(value/5));
state.profile.xp+=value;
state.profile.coins+=coinsDelta;
const rewardRef=uid('rxp');
state.game.rewardXp.push({id:rewardRef,amount:value,coins:coinsDelta,source:source||'action',date:today()});
const after=levelFromXp(state.profile.xp);
if(after.level>before.level)journalEntry('level','Niveau supérieur',`Tu atteins le niveau ${after.level}. ${source||'Une trace de plus.'}`);
unlockCompanions();
unlockRegions();
checkTitles();
return{levelUp:after.level>before.level,newLevel:after.level,rewardRef,amount:value,coinsDelta}}
async function completeHabit(hid){const h=state.habits.find(x=>x.id===hid);
if(!h)return;
if(!scheduled(h))return showToast('Pas aujourd’hui','Cette habitude n’est pas planifiée pour aujourd’hui.');
if(completion(hid))return showToast('Déjà validée','Cette quête a déjà laissé sa trace aujourd’hui.');
const comp=state.companions.find(x=>x.id===h.companionId);
const affinityBefore=comp?.totalAffinity||0;
const row={id:uid('c'),habitId:hid,date:today(),xp:h.xp,category:h.category,source:'habit',rewardRef:null};
state.completions.push(row);
const up=addXp(h.xp,'Habitude validée.');
row.rewardRef=up.rewardRef;
if(comp){addCompanionAffinity(comp,comp.favorite===h.category?6:3,'une habitude liée')}recordEventTrace('habit');
journalEntry('win',h.title,`${cat(h.category).name} · +${h.xp} XP. ${companionMessage(comp)}`);
achievements();
refreshQuestLedger();
await persist();
playSound('complete');
if(up.levelUp)playSound('level');
showToast(`+${h.xp} XP`,up.levelUp?`Niveau ${up.newLevel} atteint.`:`Affinité compagnon ${Math.max(0,(comp?.totalAffinity||affinityBefore)-affinityBefore)}.`);
render()}
function rewardDelta(ref,fallbackXp=0){const row=state.game.rewardXp.find(x=>x.id===ref);
const xp=Number(row?.amount??fallbackXp);
const coins=Number(row?.coins??Math.max(1,Math.round(xp/5)));
return{x:Math.max(0,xp),coins:Math.max(0,coins),row}}
async function uncompleteHabit(hid){const c=completion(hid);
if(!c)return;
if(c.source==='ritual')return showToast('Validation groupée','Cette trace appartient à une expédition. Annule le rituel depuis la page Expéditions.');
if(!confirm('Annuler la validation du jour ?'))return;
const comp=state.companions.find(x=>x.id===state.habits.find(h=>h.id===hid)?.companionId);
if(comp){comp.totalAffinity=Math.max(0,Number(comp.totalAffinity||0)-(comp.favorite===c.category?6:3))}const delta=rewardDelta(c.rewardRef,c.xp);
state.completions=state.completions.filter(x=>x.id!==c.id);
state.profile.xp=Math.max(0,state.profile.xp-delta.x);
state.profile.coins=Math.max(0,state.profile.coins-delta.coins);
if(delta.row)state.game.rewardXp=state.game.rewardXp.filter(x=>x!==delta.row);
achievements({reconcile:true});
unlockCompanions();
syncEventTrail();
refreshQuestLedger();
await persist();
render()}
async function completeChallenge(){const ch=dailyChallenge();
if(ch.completed)return showToast('Déjà fait','Le défi du jour est déjà enregistré.');
state.challengeCompletions.push({id:uid('cc'),challengeId:ch.id,date:today(),xp:ch.xp,category:ch.category,source:'challenge',rewardRef:null});
const row=state.challengeCompletions.at(-1),up=addXp(ch.xp,'Défi du jour terminé.');
row.rewardRef=up.rewardRef;
const active=state.companions.find(x=>x.id===state.profile.activeCompanionId);
if(active) addCompanionAffinity(active,active.favorite===ch.category?4:1,'le défi du jour');
recordEventTrace('challenge');
journalEntry('challenge',ch.title,`Défi spécial terminé. +${ch.xp} XP.`);
achievements();
refreshQuestLedger();
await persist();
playSound('complete');
if(up.levelUp)playSound('level');
showToast(`Défi +${ch.xp} XP`,up.levelUp?`Niveau ${up.newLevel} atteint.`:'Le monde a noté ton passage.');
render()}
async function completeRitual(id){const r=state.rituals.find(x=>x.id===id&&!x.archived);
if(!r)return;
const date=today(),existing=state.ritualCompletions.find(x=>x.ritualId===id&&x.date===date);
if(existing)return showToast('Expédition déjà jouée','La trace existe déjà aujourd’hui.');
const steps=r.habitIds.map(hid=>state.habits.find(h=>h.id===hid)).filter(Boolean).filter(h=>scheduled(h,date));
const newly=steps.filter(h=>!completion(h.id,date));
if(!newly.length)return showToast('Rien à valider','Les étapes sont déjà accomplies ou hors programme.');
let baseXp=0;
const stepStates=[];
for(const h of newly){const row={id:uid('c'),habitId:h.id,date,xp:h.xp,category:h.category,source:'ritual',rewardRef:null};
state.completions.push(row);
baseXp+=h.xp;
stepStates.push({habitId:h.id,done:true});
const comp=state.companions.find(x=>x.id===h.companionId);
if(comp)addCompanionAffinity(comp,comp.favorite===h.category?6:3,'une étape de rituel')}const bonus=Math.max(0,Number(r.bonusXp||25));
const rr={id:uid('rr'),ritualId:id,date,xp:baseXp+bonus,steps:stepStates,bonus,source:'ritual',rewardRef:null};
state.ritualCompletions.push(rr);
recordEventTrace('ritual');
const up=addXp(baseXp+bonus,'Rituel exécuté.');
rr.rewardRef=up.rewardRef;
journalEntry('ritual',r.name,`Expédition complétée. Base ${baseXp} XP + bonus ${bonus} XP.`);
achievements();
refreshQuestLedger();
await persist();
playSound('reward');
if(up.levelUp)playSound('level');
showToast(`Rituel +${baseXp+bonus} XP`,up.levelUp?`Niveau ${up.newLevel} atteint.`:'Expédition terminée.');
render()}
function dailyTreasure(){return TREASURES[hashString(`treasure:${today()}`)%TREASURES.length]}
async function claimDailyTreasure(){const t=dailyTreasure();
if(state.game.claimedDailyTreasures.includes(today()))return;
state.game.claimedDailyTreasures.push(today());
const up=addXp(t.xp,'Trésor quotidien.');
state.profile.coins+=t.coins;
journalEntry('reward',t.name,`Trésor du jour : +${t.xp} XP et ${t.coins} pièces.`);
await persist();
playSound('reward');
if(up.levelUp)playSound('level');
showToast('Petite trouvaille',`${t.name} · +${t.xp} XP`);
render()}
async function claimQuest(defId){const def=QUEST_DEFS.find(x=>x.id===defId);
if(!def)return;
refreshQuestLedger();
const run=getQuestRun(def);
if(!run||run.claimed)return;
if(!run.ready)return showToast('Encore un peu',`Objectif : ${def.target}.`);
run.claimed=true;
run.claimedAt=new Date().toISOString();
const up=addXp(def.xp,`Quête ${def.name} réclamée.`);
state.profile.coins+=def.coins;
journalEntry('quest',def.name,`Récompense : +${def.xp} XP et ${def.coins} pièces.`);
achievements();
await persist();
playSound('reward');
if(up.levelUp)playSound('level');
showToast('Quête réclamée',`+${def.xp} XP · +${def.coins} pièces`);
render()}
async function claimSeasonGoal(goalId){const goal=SEASON_GOALS.find(x=>x.id===goalId);
if(!goal||state.game.claimedSeasonGoals.includes(goalId)||seasonGoalProgress(goal)<goal.target)return;
state.game.claimedSeasonGoals.push(goalId);
const up=addXp(goal.xp,`Objectif de saison ${goal.name}.`);
state.profile.coins+=goal.coins;
journalEntry('season',goal.name,`Objectif de saison complété. +${goal.xp} XP et ${goal.coins} pièces.`);
await persist();
playSound('reward');
if(up.levelUp)playSound('level');
showToast('Objectif de saison',goal.name);
render()}
async function claimEvent(){const e=state.game.event;
if(e.claimed||e.progress<e.target)return;
e.claimed=true;
const up=addXp(e.reward.xp,'Récompense événement.');
state.profile.coins+=e.reward.coins;
journalEntry('event','La trace des lanternes','Cinq lumières ont été réunies.');
await persist();
playSound('event');
if(up.levelUp)playSound('level');
showToast('Événement terminé','La lanterne finale reste allumée.');
render()}
function createAdaptiveCompanion(c){return{tier:c.evolutionTier,affinity:c.affinity,message:companionMessage(c),appearance:companionAppearanceAsset(c)}}

// === js/views/views.js ===
function shell(content){
  const lv=levelFromXp(state.profile.xp);
  const current=routePath();
  const primary=[
    ['#/dashboard','Accueil'],['#/today','Aujourd’hui'],['#/habits','Habitudes'],['#/quests','Quêtes'],
    ['#/rituals','Rituels'],['#/map','Carte'],['#/stats','Stats']
  ];
  const secondary=[
    ['#/character','Personnage'],['#/companions','Compagnons'],['#/collection','Collection'],['#/rewards','Récompenses'],
    ['#/achievements','Succès'],['#/event','Événement'],['#/consistency','Constance'],['#/journal','Journal'],
    ['#/timeline','Chronologie'],['#/lab','Laboratoire'],['#/friction','Radar de friction'],['#/settings','Paramètres'],['#/backup','Import / export']
  ];
  const link=([href,label])=>`<a class="${current===href.slice(1)?'active':''}" href="${href}">${label}</a>`;
  const more=secondary.map(link).join('');
  const initials=modernInitials(state.profile.name);
  return `<div class="app-shell modern-shell">
    <header class="topbar">
      <div class="topbar__brand"><a class="brand-link" href="#/dashboard"><span class="brand-mark" aria-hidden="true"></span><span><span class="brand-title">Habit Quest</span><span class="brand-kicker">LOCAL / PRIVATE</span></span></a></div>
      <nav class="desktop-nav" aria-label="Navigation principale">${primary.map(link).join('')}<details class="nav-more"><summary>Plus <span aria-hidden="true">+</span></summary><div class="nav-more__menu">${more}</div></details></nav>
      <div class="topbar__status"><span class="topbar__stat"><span class="status-dot" aria-hidden="true"></span>Niv. <strong>${lv.level}</strong></span><span class="topbar__stat">${state.profile.coins} pièces</span><span class="topbar__stat">${streak()} jours</span><a class="identity-mini" href="#/character" aria-label="Ouvrir le profil de ${esc(state.profile.name)}">${initials}</a></div>
    </header>
    <main class="main"><div class="page">${content}</div></main>
    <nav class="mobile-nav" aria-label="Navigation mobile"><a href="#/dashboard">Accueil</a><a href="#/today">Jour</a><a href="#/habits">Habitudes</a><a href="#/quests">Quêtes</a><a href="#/character">Profil</a></nav>
  </div><div id="toast-root" aria-live="polite"></div><div id="modal-root"></div>`;
}
function modernInitials(name){return String(name||'HQ').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'HQ'}

function pageHead(eyebrow,h1,desc,actions=''){return `<div class="page-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h1>${h1}</h1>${desc?`<p>${desc}</p>`:''}</div><div class="page-head__actions">${actions}</div></div>`}

function statCard(label,value,meta){return `<div class="stat"><span class="label">${esc(label)}</span><strong>${esc(value)}</strong><small class="muted">${esc(meta)}</small></div>`}

function progressBar(v,cls=''){return `<div class="progress ${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(clamp(v,0,100))}"><span style="width:${clamp(v,0,100)}%"></span></div>`}

function button(text,action,id='',cls=''){const safe=String(id||'');return `<button class="${cls}" data-action="${esc(action)}" ${safe?`data-id="${esc(safe)}"`:''}>${esc(text)}</button>`}

function playerAvatarScene(size='lg'){
  const eq=state.profile.equipped||{};
  const items=Object.values(eq).filter(Boolean).map(id=>REWARDS.find(r=>r.id===id)).filter(Boolean);
  const initials=modernInitials(state.profile.name);
  return `<div class="avatar-scene avatar-scene--${esc(size)}"><div class="avatar-orb avatar-orb--${esc(size)}" aria-label="Profil de ${esc(state.profile.name)}"><span class="avatar-initial">${initials}</span><span class="avatar-orb__tag">NIV. ${levelFromXp(state.profile.xp).level}</span></div><div class="avatar-equipment-list">${items.length?items.map(r=>`<span class="pill">${esc(r.name)}</span>`).join(''):'<span class="muted">Identité personnalisable</span>'}</div></div>`;
}

function habitCard(h){const done=Boolean(completion(h.id));
const c=cat(h.category);
const mark=(String(h.title||'').trim()[0]||'•').toUpperCase();
return `<article class="card quest-card ${done?'completed':''} ${h.archived?'archived-card':''}"><div class="quest-card__top"><div class="quest-card__icon" style="--habit-color:${esc(h.color||c.color)}" aria-hidden="true"></div><div class="grow"><div class="label">${esc(c.name)} · ${esc(h.difficulty)} · ${h.archived?'Archivée':'Active'}</div><h3>${esc(h.title)}</h3><p>${esc(h.desc)}</p><span class="pill">${mark} · ${esc(h.targetTime||'libre')}</span></div><span class="pill gold">+${h.xp} XP</span></div><div class="row" style="margin-top:16px"><span class="pill">${momentBucket(h.targetTime)}</span><span class="pill">${frequencyLabel(h)}</span><span class="pill">Maîtrise ${mastery(h)}%</span><span class="pill">Série ${habitStreak(h.id)}</span><span class="pill">${h.substeps?.length||0} étapes</span></div><div class="row" style="margin-top:16px"><a class="btn small" href="#/habits/${encodeURIComponent(h.id)}">Voir</a>${!h.archived?(done?(completion(h.id)?.source==='ritual'?'<a class="btn small ghost" href="#/rituals">Rituel</a>':button('Annuler','uncomplete',h.id,'small ghost')):button('Valider','complete',h.id,'small gold')):''}<a class="btn small ghost" href="#/habits/${encodeURIComponent(h.id)}/edit">Modifier</a><button class="small ghost" data-action="archive" data-id="${esc(h.id)}">${h.archived?'Restaurer':'Archiver'}</button></div></article>`}

function dashboard(){const lv=levelFromXp(state.profile.xp),hs=activeHabits().filter(h=>scheduled(h)),done=hs.filter(h=>completion(h.id)).length,ch=dailyChallenge(),comp=state.companions.find(x=>x.id===state.profile.activeCompanionId)||state.companions[0],unlocked=REGIONS.filter(r=>state.game.unlockedRegions.includes(r.id)),oracle=hs.find(h=>!completion(h.id)&&h.duration<=15)||hs.find(h=>!completion(h.id));
return shell(`${pageHead('Campement','Bienvenue, '+esc(state.profile.name),'Le chapitre du jour est une suite de petites preuves, pas une montagne.','<a class="btn gold" href="#/habits/new">+ Nouvelle quête</a>')}<section class="hero"><div class="hero__copy"><span class="ribbon">Chapitre ${lv.level}</span><h2 style="font-size:34px;margin:12px 0 7px">Le monde bouge quand tu bouges.</h2><p class="quote">${esc(companionMessage(comp))}</p><div class="row" style="margin-top:12px"><span class="pill gold">${lv.into}/${lv.next} XP</span><span class="pill">${currentStreakText()}</span><span class="pill">${esc(state.game.season.name)}</span></div></div><div class="hero__character">${playerAvatarScene('lg')}</div></section><div style="height:14px"></div><div class="stat-grid">${statCard('Niveau',lv.level,`${lv.into}/${lv.next} XP`)}${statCard('Série',streak(),'jours actifs')} ${statCard('Pièces',state.profile.coins,'récompenses')} ${statCard('Régions',unlocked.length,'ouvertes')}</div><div style="height:14px"></div><div class="card card--gold"><div class="section-title"><div><span class="label">Météo intérieure</span><h3>${esc(weatherLine(innerWeather()))}</h3></div><span class="pill gold">7 jours</span></div><div class="grid grid-4"><div class="stat"><small>Régularité</small><strong>${innerWeather().regularity}%</strong></div><div class="stat"><small>Focus</small><strong>${innerWeather().focus}%</strong></div><div class="stat"><small>Énergie</small><strong>${innerWeather().energy}%</strong></div><div class="stat"><small>Repos</small><strong>${innerWeather().rest}%</strong></div></div></div><div style="height:14px"></div><div class="split"><div class="stack"><div class="card card--gold"><div class="section-title"><div><span class="label">Aujourd’hui</span><h3>${done}/${hs.length} quêtes accomplies</h3></div><a class="btn small" href="#/today">Ouvrir</a></div>${progressBar(hs.length?done/hs.length*100:0)}<div class="row" style="margin-top:10px"><span class="pill gold">Défi : ${esc(ch.title)}</span><span class="pill">+${ch.xp} XP</span></div></div><div class="card"><div class="section-title"><div><span class="label">Oracle de routine</span><h3>${oracle?esc(oracle.title):'Tout est propre pour aujourd’hui'}</h3></div><img src="assets/icons/spark.svg" width="28" alt=""></div><p>${oracle?'La prochaine petite action mesurable est prête.':'Prépare demain ou écris trois lignes au journal.'}</p>${oracle?`<a class="btn small gold" href="#/habits/${oracle.id}">Voir la quête</a>`:'<button class="small" data-action="daily-note">Écrire une note</button>'}</div><div class="card"><div class="section-title"><h3>Événement</h3><a class="btn small" href="#/event">Voir</a></div><p>Lanternes : ${state.game.event.progress}/${state.game.event.target}.</p>${progressBar(state.game.event.progress/state.game.event.target*100)}</div></div><div class="stack"><div class="card"><div class="section-title"><h3>Compagnon actif</h3><a class="btn small" href="#/companions">Changer</a></div><div class="character-card"><img src="${companionAppearanceAsset(comp)}" alt="${esc(comp.name)}"><div><strong>${esc(comp.name)}</strong><div class="muted">${esc(comp.title)}</div><div style="margin-top:6px">Affinité ${comp.affinity}% · Niv. ${comp.level} · Évolution ${comp.evolutionTier}/3</div>${progressBar(comp.affinity,'knowledge')}</div></div></div><div class="card"><div class="section-title"><h3>Expédition</h3><a class="btn small" href="#/rituals">Voir</a></div><p>Rituels actifs : ${state.rituals.filter(r=>!r.archived).length}. Exécuter un rituel valide plusieurs étapes et ajoute un bonus.</p></div><div class="card"><div class="section-title"><h3>Région courante</h3><a class="btn small" href="#/map">Carte</a></div><div class="identity-mark" style="width:58px;height:58px;margin-bottom:12px">${String((unlocked.at(-1)?.name||REGIONS[0].name)[0]||'H').toUpperCase()}</div><p style="margin:0">${esc(unlocked.at(-1)?.name||REGIONS[0].name)}</p></div></div></div>`)}
function todayView(){const hs=activeHabits().filter(h=>scheduled(h)),ch=dailyChallenge(),treasure=dailyTreasure(),treasureClaimed=state.game.claimedDailyTreasures.includes(today()),runs=QUEST_DEFS.map(def=>getQuestRun(def));
return shell(`${pageHead('Chapitre du jour','Aujourd’hui','Une mission claire, puis le reste peut attendre.','<a class="btn" href="#/quests">Quêtes</a>')}<div class="grid grid-3"><div class="card card--gold"><span class="label">Défi du jour</span><h2>${esc(ch.title)}</h2><p>${esc(ch.desc)}</p><span class="pill gold">+${ch.xp} XP</span><div style="margin-top:12px">${button(ch.completed?'Défi validé':'Valider le défi','complete-challenge','',ch.completed?'small ghost':'small gold')}</div></div><div class="card"><span class="label">Rythme</span><h3>${currentStreakText()}</h3><p>La série mesure le retour, pas la perfection.</p>${progressBar(clamp(streak()*10,0,100))}</div><div class="card"><span class="label">Petite trouvaille</span><h3>${esc(treasure.name)}</h3><p>${esc(treasure.desc)}</p>${treasureClaimed?'<span class="pill green">Trouvaille récupérée</span>':button(`Ouvrir · +${treasure.xp} XP`,'claim-daily-treasure','','small gold')}</div></div><div style="height:14px"></div><div class="card"><div class="section-title"><h3>Ledger du jour</h3><span class="muted">Les objectifs gardent leur état</span></div><div class="grid grid-3">${runs.filter(Boolean).filter(r=>r.period==='daily').map(r=>`<div class="stat"><small class="muted">${esc(r.defId)}</small><strong>${r.progress}/${r.target}</strong><small>${r.claimed?'Réclamée':r.ready?'Prête à réclamer':'En cours'}</small></div>`).join('')}</div></div><div style="height:14px"></div>${hs.length?`<div class="grid grid-2">${hs.map(habitCard).join('')}</div>`:'<div class="empty">Aucune quête planifiée aujourd’hui. Prépare une action pour demain.</div>'}`)}
function habitsView(){return shell(`${pageHead('Camp','Habitudes','Le registre complet de tes quêtes.','<a class="btn gold" href="#/habits/new">+ Nouvelle habitude</a>')}<div class="card"><div class="form-grid"><div class="field"><label for="habit-search">Rechercher</label><input id="habit-search" data-filter="habit-search" placeholder="Lire, sport, sommeil..."></div><div class="field"><label for="habit-filter">Catégorie</label><select id="habit-filter" data-filter="habit-category"><option value="all">Toutes</option>${CATEGORIES.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div class="field"><label for="habit-status">Statut</label><select id="habit-status" data-filter="habit-status"><option value="active">Actives</option><option value="archived">Archivées</option><option value="all">Toutes</option></select></div><div class="field"><label for="habit-sort">Trier</label><select id="habit-sort" data-filter="habit-sort"><option value="title">Nom</option><option value="xp">XP</option><option value="mastery">Maîtrise</option><option value="duration">Durée</option></select></div><div class="field"><label for="habit-group">Regrouper</label><select id="habit-group" data-filter="habit-group"><option value="none">Aucun</option><option value="category">Catégorie</option><option value="time">Moment</option></select></div></div></div><div style="height:14px"></div><div id="habit-list" class="grid grid-2"></div>`)}
function frequencyLabel(h){const map={daily:'Chaque jour',weekdays:'Jours ouvrés',weekends:'Week-end',weekly:'Jours choisis',specific:'Jours précis'};
const base=map[h.frequency]||'Flexible';
return (h.frequency==='weekly'||h.frequency==='specific')&&h.days?.length?`${base} · ${h.days.map(d=>['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'][d]).join(', ')}`:base}
function habitDetailView(id){const h=state.habits.find(x=>x.id===id);
if(!h)return shell(pageHead('Erreur','Quête introuvable','Cette trace ne pointe plus vers une habitude.'));
const c=cat(h.category),comp=h.companionId&&state.companions.find(x=>x.id===h.companionId);
const history=recentDays(30).map(d=>({d,done:Boolean(completion(h.id,d))}));
const stepDone=(h.substeps||[]).filter(st=>state.substepCompletions.some(x=>x.substepId===st.id&&x.date===today())).length;
return shell(`${pageHead('Quête',esc(h.title),esc(h.desc),`<a class="btn" href="#/habits/${h.id}/edit">Modifier</a>`)}<div class="split"><div class="stack"><div class="card card--${h.category==='energie'?'energy':h.category==='sante'?'health':h.category==='connaissance'?'knowledge':''}"><div class="row"><span class="pill">${esc(c.name)}</span><span class="pill gold">+${h.xp} XP</span><span class="pill">${esc(h.difficulty)}</span><span class="pill">${h.duration} min</span></div><div style="height:12px"></div><span class="label">Maîtrise 30 jours</span><h2>${mastery(h)}%</h2>${progressBar(mastery(h),h.category==='sante'?'health':h.category==='connaissance'?'knowledge':'')}<div class="row" style="margin-top:12px"><span class="pill">${frequencyLabel(h)}</span><span class="pill">Cible : ${esc(h.targetTime||'libre')}</span><span class="pill">Importance ${h.importance}/3</span></div></div><div class="card"><div class="section-title"><h3>30 jours</h3><span class="pill">${completedCount(h.id,30)} validations</span></div><div class="dot-grid">${history.map(x=>`<div class="day-cell ${x.done?'on':''}" title="${esc(fmtDate(x.d))}"><span>${parseDay(x.d).getDate()}</span></div>`).join('')}</div></div><div class="card"><div class="section-title"><h3>Sous-étapes</h3><span class="pill">${stepDone}/${h.substeps?.length||0}</span></div>${(h.substeps||[]).length?`<div class="stack">${h.substeps.map(st=>{const done=state.substepCompletions.some(x=>x.substepId===st.id&&x.date===today());
return `<button class="list-item substep ${done?'done':''}" data-action="toggle-substep" data-id="${h.id}:${st.id}"><span class="substep-box">${done?'✓':''}</span><span class="grow">${esc(st.title)}</span></button>`}).join('')}</div>`:'<div class="empty">Aucune sous-étape.</div>'}</div><div class="card"><div class="section-title"><h3>Historique</h3><span class="muted">preuves réelles</span></div>${state.completions.filter(x=>x.habitId===h.id).slice(-12).reverse().map(x=>`<div class="list-item"><img src="assets/icons/check.svg" width="22" alt=""><div class="grow"><div class="title">${esc(fmtDate(x.date))}</div><div class="meta">+${x.xp} XP · ${esc(x.source==='ritual'?'Rituel':c.name)}</div></div></div>`).join('')||'<div class="empty">Pas encore de trace.</div>'}</div></div><div class="stack"><div class="card"><span class="label">Actions</span><div class="row" style="margin-top:10px">${completion(h.id)?button('Annuler aujourd’hui','uncomplete',h.id,'small ghost'):button('Valider aujourd’hui','complete',h.id,'small gold')}<button class="small" data-action="archive" data-id="${h.id}">${h.archived?'Restaurer':'Archiver'}</button><button class="small danger" data-action="delete-habit" data-id="${h.id}">Supprimer</button></div></div><div class="card">${comp?`<div class="character-card"><img src="${companionAppearanceAsset(comp)}" alt="${esc(comp.name)}"><div><span class="label">Compagnon associé</span><h3>${esc(comp.name)}</h3><div class="muted">${esc(comp.title)}</div>${progressBar(comp.affinity,'knowledge')}</div></div>`:'<span class="label">Aucun compagnon</span><p>Associe cette quête à un compagnon depuis l’édition.</p>'}</div><div class="card card--gold"><span class="label">Notes</span><p>${esc(h.notes||'Aucune note.')} </p><div class="row"><span class="pill">Créée ${esc(fmtDate(h.createdAt))}</span>${h.startDate?`<span class="pill">Début ${esc(fmtDate(h.startDate))}</span>`:''}${h.endDate?`<span class="pill">Fin ${esc(fmtDate(h.endDate))}</span>`:''}</div></div></div></div>`)}
function habitEditView(id){const h=id?state.habits.find(x=>x.id===id):null;
if(id&&!h)return shell(pageHead('Quête','Introuvable','La fiche demandée n’existe plus.'));
const f=h||{id:'',title:'',desc:'',category:'constance',difficulty:'medium',frequency:'daily',days:[0,1,2,3,4,5,6],targetTime:'',xp:25,importance:2,duration:10,notes:'',icon:'flame.svg',color:'#b56d52',substeps:[],companionId:null,startDate:null,endDate:null};
const dayNames=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
return shell(`${pageHead('Forge',h?'Modifier la quête':'Nouvelle quête','Chaque champ produit une règle réelle dans le moteur local.')}<form id="habit-form" class="card"><input type="hidden" name="id" value="${esc(f.id)}"><div class="form-grid"><div class="field full"><label>Nom</label><input name="title" required maxlength="60" value="${esc(f.title)}"></div><div class="field full"><label>Description</label><textarea name="desc" maxlength="240">${esc(f.desc)}</textarea></div><div class="field"><label>Catégorie</label><select name="category">${CATEGORIES.map(c=>`<option value="${c.id}" ${f.category===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div><div class="field"><label>Difficulté</label><select name="difficulty"><option value="easy" ${f.difficulty==='easy'?'selected':''}>Facile</option><option value="medium" ${f.difficulty==='medium'?'selected':''}>Moyen</option><option value="hard" ${f.difficulty==='hard'?'selected':''}>Difficile</option></select></div><div class="field"><label>Fréquence</label><select name="frequency"><option value="daily" ${f.frequency==='daily'?'selected':''}>Chaque jour</option><option value="weekdays" ${f.frequency==='weekdays'?'selected':''}>Jours ouvrés</option><option value="weekends" ${f.frequency==='weekends'?'selected':''}>Week-end</option><option value="weekly" ${f.frequency==='weekly'?'selected':''}>Jours choisis</option><option value="specific" ${f.frequency==='specific'?'selected':''}>Jours précis</option></select></div><div class="field"><label>XP personnalisé (5 à 100)</label><input name="xp" type="number" min="5" max="100" value="${Number(f.xp||25)}"></div><div class="field"><label>Durée estimée (minutes)</label><input name="duration" type="number" min="1" max="240" value="${Number(f.duration||10)}"></div><div class="field"><label>Heure cible</label><input name="targetTime" type="time" value="${esc(f.targetTime||'')}"></div><div class="field"><label>Importance</label><select name="importance"><option value="1" ${Number(f.importance)===1?'selected':''}>Basse</option><option value="2" ${Number(f.importance)===2?'selected':''}>Normale</option><option value="3" ${Number(f.importance)===3?'selected':''}>Haute</option></select></div><div class="field"><label>Début de validité</label><input name="startDate" type="date" value="${esc(f.startDate||'')}"></div><div class="field"><label>Fin de validité</label><input name="endDate" type="date" value="${esc(f.endDate||'')}"></div><div class="field full"><label>Jours choisis</label><div class="chip-row">${dayNames.map((d,i)=>`<label class="chip"><input type="checkbox" name="days" value="${i}" ${f.days?.includes(i)?'checked':''}> ${d}</label>`).join('')}</div></div><div class="field"><label>Icône</label><select name="icon"><option value="flame.svg" ${f.icon==='flame.svg'?'selected':''}>Flamme</option><option value="book.svg" ${f.icon==='book.svg'?'selected':''}>Livre</option><option value="health.svg" ${f.icon==='health.svg'?'selected':''}>Santé</option><option value="clock.svg" ${f.icon==='clock.svg'?'selected':''}>Horloge</option><option value="spark.svg" ${f.icon==='spark.svg'?'selected':''}>Étincelle</option><option value="settings.svg" ${f.icon==='settings.svg'?'selected':''}>Organisation</option></select></div><div class="field"><label>Couleur</label><select name="color">${Object.entries({"#b56d52":'Terre',"#6f86b9":'Connaissance',"#9a949b":'Pierre',"#d98a48":'Énergie',"#6da66b":'Feuille',"#69789d":'Nuit'}).map(([v,n])=>`<option value="${v}" ${f.color===v?'selected':''}>${n}</option>`).join('')}</select></div><div class="field"><label>Compagnon</label><select name="companionId"><option value="">Aucun</option>${state.companions.filter(c=>c.unlocked).map(c=>`<option value="${c.id}" ${f.companionId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div><div class="field full"><label>Sous-étapes (une ligne = une étape)</label><textarea name="substeps" placeholder="Préparer l’espace\nFaire l’action\nRanger">${esc((f.substeps||[]).map(s=>s.title).join('\n'))}</textarea></div><div class="field full"><label>Notes</label><textarea name="notes" maxlength="500">${esc(f.notes||'')}</textarea></div></div><div class="row" style="margin-top:14px"><button class="gold" type="submit">${h?'Enregistrer la quête':'Créer la quête'}</button><a class="btn" href="#/habits">Annuler</a></div></form>`)}
function mapView(){const current=state.game.campaign.currentRegion||'forest';
return shell(`${pageHead('Atlas','Carte du monde','Une carte éditoriale, lisible d’un coup d’œil. Chaque territoire conserve sa progression locale.')}
<section class="card map-frame" aria-label="Carte des régions"><div class="map-pins">${REGIONS.map((r,i)=>{const open=state.game.unlockedRegions.includes(r.id);return `<a href="#/unlock/${encodeURIComponent(r.id)}" class="map-pin ${open?'':'locked'}" style="left:${12+(i%4)*22}%;top:${18+Math.floor(i/4)*42}%" title="${esc(r.name)}" aria-label="${esc(r.name)} · ${open?'ouverte':'verrouillée'}"><span aria-hidden="true">${open?'✓':'•'}</span></a>`}).join('')}</div></section>
<div style="height:18px"></div><div class="grid grid-3">${REGIONS.map((r,i)=>{const open=state.game.unlockedRegions.includes(r.id),isCurrent=current===r.id;return `<article class="card ${isCurrent?'card--gold':''} ${open?'':'inset'}"><div class="row"><span class="identity-mark">${String(i+1).padStart(2,'0')}</span><span class="pill ${open?'green':'red'}">${open?'Ouverte':`Niv. ${r.unlockLevel}`}</span></div><h3 style="margin-top:18px">${esc(r.name)}</h3><p>${esc(r.desc)}</p>${open?`<button class="small ${isCurrent?'ghost':'gold'}" data-action="set-region" data-id="${esc(r.id)}">${isCurrent?'Région actuelle':'Choisir cette région'}</button>`:''}</article>`}).join('')}</div>`)}

function questsView(){refreshQuestLedger();
return shell(`${pageHead('Journal de quêtes','Quêtes persistantes','Chaque instance garde sa période, sa progression, son état de réclamation et sa récompense.')}<div class="grid grid-3">${QUEST_DEFS.map(def=>{const run=getQuestRun(def),p=run.progress,done=run.ready;return `<div class="card ${done&&!run.claimed?'card--gold':''}"><span class="label">${def.period==='daily'?'Aujourd’hui':def.period==='weekly'?'Cette semaine':def.period==='monthly'?'Ce mois':'Saison'}</span><h3>${esc(def.name)}</h3><p>${esc(def.desc)}</p>${progressBar(done?100:p/def.target*100)}<div class="row"><span class="pill gold">+${def.xp} XP</span><span class="pill">${p}/${def.target}</span><span class="pill">${fmtDate(run.start)}</span></div>${run.claimed?'<span class="pill green">Réclamée</span>':done?button('Réclamer','claim-quest',def.id,'small gold'):'<span class="muted">Preuve encore incomplète.</span>'}</div>`}).join('')}</div><div style="height:14px"></div><div class="card card--gold"><div class="section-title"><div><span class="label">Objectifs de saison</span><h3>${esc(state.game.season.name)}</h3></div><span class="pill">Jour ${state.game.season.day}/${state.game.season.durationDays}</span></div><div class="grid grid-3">${SEASON_GOALS.map(g=>{const p=seasonGoalProgress(g),claimed=state.game.claimedSeasonGoals.includes(g.id);return `<div class="stat"><strong>${Math.min(g.target,p)}/${g.target}</strong><small>${esc(g.name)}</small><p>${esc(g.desc)}</p>${claimed?'<span class="pill green">Réclamé</span>':p>=g.target?button('Réclamer','claim-season-goal',g.id,'small gold'):''}</div>`}).join('')}</div></div>`)}
function challengesView(){const ch=dailyChallenge();
return shell(`${pageHead('Défis','Défi du jour','Le défi tourne chaque jour de façon déterministe. Pas de serveur nécessaire.')}<div class="card card--gold"><div class="row"><div class="grow"><span class="label">Aujourd’hui</span><h2>${esc(ch.title)}</h2><p>${esc(ch.desc)}</p></div><span class="pill gold">+${ch.xp} XP</span></div>${button(ch.completed?'Déjà validé':'Valider le défi','complete-challenge','',ch.completed?'small ghost':'small gold')}</div><div style="height:14px"></div><div class="grid grid-3">${CHALLENGES.map(c=>`<div class="card"><span class="label">${esc(cat(c.category).name)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><span class="pill">${c.xp} XP</span></div>`).join('')}</div>`)}
function ritualsView(){const active=state.rituals.filter(r=>!r.archived);
return shell(`${pageHead('Expéditions','Rituels','Regroupe plusieurs habitudes en une mission. Le bonus est gagné une seule fois par date.','<button class="btn gold" data-action="new-ritual">+ Créer une expédition</button>')}<div class="grid grid-2">${active.map(r=>{const todayRun=state.ritualCompletions.find(x=>x.ritualId===r.id&&x.date===today());const steps=r.habitIds.map(id=>state.habits.find(h=>h.id===id)).filter(Boolean);const done=steps.filter(h=>completion(h.id)).length;return `<div class="card ${todayRun?'completed card--gold':''}"><div class="section-title"><div><span class="label">Expédition</span><h3>${esc(r.name)}</h3></div><span class="pill gold">+${r.bonusXp} bonus</span></div><p>${esc(r.description||'Une séquence courte pour donner un élan à la journée.')}</p><div class="stack">${steps.map(h=>`<div class="list-item"><img src="assets/icons/check.svg" width="18" alt=""><span class="grow">${esc(h.title)}</span><span class="pill">+${h.xp}</span></div>`).join('')}</div><div style="height:8px"></div>${progressBar(steps.length?done/steps.length*100:0)}<div class="row" style="margin-top:10px"><span class="pill">${done}/${steps.length} aujourd’hui</span>${todayRun?button('Annuler','undo-ritual',todayRun.id,'small ghost') :button('Lancer','complete-ritual',r.id,'small gold')}<button class="small" data-action="archive-ritual" data-id="${r.id}">Archiver</button><button class="small danger" data-action="delete-ritual" data-id="${r.id}">Supprimer</button></div></div>`}).join('')||'<div class="empty">Aucune expédition active. Crée ton premier rituel.</div>'}</div><div style="height:14px"></div><div class="card inset"><span class="label">Historique des expéditions</span>${state.ritualCompletions.slice(-12).reverse().map(x=>{const r=state.rituals.find(y=>y.id===x.ritualId);return `<div class="list-item"><div class="grow"><strong>${esc(r?.name||x.ritualId)}</strong><div class="muted">${esc(fmtDate(x.date))}</div></div><span class="pill gold">+${x.xp} XP</span></div>`}).join('')||'<p class="muted">Aucune expédition jouée.</p>'}</div>`)}
function characterView(){const lv=levelFromXp(state.profile.xp);
return shell(`${pageHead('Aventurier','Personnage','Une identité persistante, des cosmétiques équipables et des titres déblocables.')}
<div class="split"><div class="stack"><div class="card card--gold center">${playerAvatarScene('xl')}<h2>${esc(state.profile.name)}</h2><span class="pill gold">${esc(state.profile.title)}</span><p>${esc(state.profile.archetype)} · Niveau ${lv.level}</p>${progressBar(lv.into/lv.next*100)}</div><div class="card"><span class="label">Titres déblocables</span><div class="chip-row" style="margin-top:12px">${TITLE_OPTIONS.map(t=>`<button class="chip ${state.profile.title===t.name?'active':''}" ${state.profile.unlockedTitles.includes(t.id)?`data-action="set-title" data-id="${esc(t.id)}"`:'disabled'}>${esc(t.name)}</button>`).join('')}</div></div></div>
<div class="stack"><div class="card"><span class="label">Signature visuelle</span><div class="grid grid-3" style="margin-top:12px"><div><span class="label">Cheveux</span><div class="chip-row">${APPEARANCE_OPTIONS.hair.map(x=>`<button class="chip ${state.profile.appearance.hair===x.id?'active':''}" data-action="set-hair" data-id="${esc(x.id)}">${esc(x.name)}</button>`).join('')}</div></div><div><span class="label">Tenue</span><div class="chip-row">${APPEARANCE_OPTIONS.outfit.map(x=>`<button class="chip ${state.profile.appearance.outfit===x.id?'active':''}" data-action="set-outfit" data-id="${esc(x.id)}">${esc(x.name)}</button>`).join('')}</div></div><div><span class="label">Accent</span><div class="chip-row">${APPEARANCE_OPTIONS.accent.map(x=>`<button class="chip ${state.profile.appearance.accent===x.id?'active':''}" data-action="set-accent" data-id="${esc(x.id)}">${esc(x.name)}</button>`).join('')}</div></div></div></div>
<div class="card"><div class="section-title"><h3>Équipement</h3><a class="btn small" href="#/rewards">Récompenses</a></div>${['neck','hand','charm','relic'].map(slot=>{const id=state.profile.equipped?.[slot];const r=REWARDS.find(x=>x.id===id);return `<div class="list-item"><span class="label">${esc(slot)}</span><div class="grow">${r?`<strong>${esc(r.name)}</strong>`:'<span class="muted">Vide</span>'}</div>${r?button('Retirer','equip-reward',r.id,'small ghost'):''}</div>`}).join('')}</div>
</div></div>`)}

function companionsView(){unlockCompanions();
return shell(`${pageHead('Compagnie','Compagnons','Ils gagnent de l’affinité, évoluent en trois paliers et réagissent au parcours.')}
<div class="grid grid-3">${state.companions.map(c=>{const view=createAdaptiveCompanion(c),unlocked=c.unlocked,active=c.id===state.profile.activeCompanionId;const initials=modernInitials(c.name);return `<article class="card ${active?'card--gold':''} ${unlocked?'':'inset'}"><div class="character-card"><div class="companion-avatar" aria-hidden="true">${initials}</div><div><span class="label">${esc(c.rarity)} · évolution ${view.tier}/3</span><h3>${esc(c.name)}</h3><div class="muted">${esc(c.title)}</div></div></div><p>${esc(c.story)}</p>${unlocked?`<div class="row"><span class="pill">Niv. ${c.level}</span><span class="pill">${c.affinity}% / 100</span></div>${progressBar(c.affinity,'knowledge')}<div class="row" style="margin-top:12px">${button(active?'Actif':'Choisir','select-companion',c.id,active?'small ghost':'small gold')}</div><div class="chip-row" style="margin-top:12px">${c.appearances.map(a=>`<button class="chip ${c.activeAppearance===a?'active':''}" data-action="set-companion-appearance" data-id="${esc(c.id)}:${esc(a)}">${a==='base'?'Base':a==='focus'?'Concentré':a==='happy'?'Heureux':'Surprise'}</button>`).join('')}</div><p class="muted">${esc(view.message)}</p>`:`<span class="pill red">Verrouillé</span><p class="muted">${esc(unlockLabel(c))}</p>`}</article>`}).join('')}</div>`)}

function unlockLabel(c){if(!c.unlock)return'Condition inconnue';
if(c.unlock.type==='level')return`Atteindre le niveau ${c.unlock.value}`;
if(c.unlock.type==='category')return`${c.unlock.count} validations en ${cat(c.unlock.category).name}`;
if(c.unlock.type==='category-days')return`${c.unlock.count} jours avec une trace en ${cat(c.unlock.category).name}`;
return'Disponible au départ'}
function collectionView(){const owned=state.inventory.map(id=>REWARDS.find(r=>r.id===id)).filter(Boolean);
const titles=TITLE_OPTIONS.filter(t=>state.profile.unlockedTitles.includes(t.id));
return shell(`${pageHead('Collection','Collection','Objets, compagnons, titres et succès réunis dans une vue calme et éditoriale.')}<div class="grid grid-3"><div class="stat"><span class="label">Cosmétiques</span><strong>${owned.length}/${REWARDS.length}</strong><small>Objets possédés</small></div><div class="stat"><span class="label">Compagnons</span><strong>${state.companions.filter(c=>c.unlocked).length}/${state.companions.length}</strong><small>Présences débloquées</small></div><div class="stat"><span class="label">Titres</span><strong>${titles.length}/${TITLE_OPTIONS.length}</strong><small>Identités gagnées</small></div></div><div style="height:18px"></div><div class="card"><div class="section-title"><h3>Objets</h3><a class="btn small" href="#/rewards">Voir les récompenses</a></div><div class="grid grid-4">${REWARDS.map((r,i)=>`<div class="stat ${state.inventory.includes(r.id)?'highlight':''}"><span class="identity-mark">${String(i+1).padStart(2,'0')}</span><strong>${esc(r.name)}</strong><small>${esc(r.rarity)}</small><small>${state.inventory.includes(r.id)?'Possédé':'À débloquer'}</small></div>`).join('')}</div></div>`)}

function rewardsView(){return shell(`${pageHead('Forge','Récompenses','Les pièces servent à personnaliser ton expérience, jamais à acheter de la performance.')}<div class="grid grid-4">${REWARDS.map((r,i)=>{const owned=state.inventory.includes(r.id),equipped=state.profile.equipped?.[r.slot]===r.id,claimed=state.game.claimedRewards.includes(r.id);return `<article class="card ${equipped?'card--gold':''}"><span class="identity-mark">${String(i+1).padStart(2,'0')}</span><span class="label" style="display:block;margin-top:14px">${esc(r.rarity)} · ${esc(r.slot)}</span><h3 style="margin-top:6px">${esc(r.name)}</h3><p>${esc(r.desc)}</p><div class="row"><span class="pill gold">${r.kind==='unlock'?'Déblocage':r.cost+' pièces'}</span></div><div class="row" style="margin-top:14px">${owned?button(equipped?'Retirer':'Équiper','equip-reward',r.id,'small gold'):claimed?'<span class="pill green">Possédé</span>':button('Forger','buy-reward',r.id,'small gold')}</div></article>`}).join('')}</div>`)}

function achievementsView(){return shell(`${pageHead('Journal de faits','Succès','Des objectifs lisibles, des récompenses persistantes.')}<div class="grid grid-3">${ACHIEVEMENTS.map((a,i)=>{const done=state.game.completedAchievements.includes(a.id);return `<article class="card ${done?'card--gold':''}"><span class="identity-mark">${String(i+1).padStart(2,'0')}</span><span class="label" style="display:block;margin-top:14px">${done?'Débloqué':'À débloquer'}</span><h3 style="margin-top:6px">${esc(a.name)}</h3><p>${esc(a.desc)}</p><span class="pill">+${a.rewardXp} XP · +${a.rewardCoins} pièces</span></article>`}).join('')}</div>`)}

function statsView(){const byCat=CATEGORIES.map(c=>{const h=activeHabits().filter(x=>x.category===c.id);
const rate=h.length?Math.round(h.reduce((n,x)=>n+mastery(x),0)/h.length):0;
return {c,rate}});
const last30=recentDays(30).map(d=>({d,n:state.completions.filter(c=>c.date===d).length+state.challengeCompletions.filter(c=>c.date===d).length+state.ritualCompletions.filter(c=>c.date===d).length}));
const max=Math.max(1,...last30.map(x=>x.n));
return shell(`${pageHead('Observatoire','Statistiques','Les nombres montrent ce qui s’est passé. Ils ne prétendent pas lire l’avenir.')}<div class="stat-grid">${statCard('XP total',state.profile.xp,'profil')} ${statCard('Meilleure série',bestStreak(),'jours')} ${statCard('Validations',state.completions.length,'habitudes')} ${statCard('Défis',state.challengeCompletions.length,'réussis')}</div><div style="height:14px"></div><div class="split"><div class="card"><h3>Territoires</h3>${byCat.map(x=>`<div class="row" style="margin-top:10px"><span class="grow">${esc(x.c.name)}</span><strong>${x.rate}%</strong></div>${progressBar(x.rate)} `).join('')}</div><div class="card"><h3>30 derniers jours</h3><div class="timeline">${last30.map(x=>`<div><div class="bar" style="height:${Math.max(5,x.n/max*150)}px" title="${x.n} traces"></div><div class="day">${parseDay(x.d).getDate()}</div></div>`).join('')}</div></div></div>`)}
function consistencyView(){const days=recentDays(30),successByDow=Array(7).fill(0),attemptByDow=Array(7).fill(0),byHour={};
for(const h of activeHabits())for(const d of days){if(scheduled(h,d)){attemptByDow[weekday(d)]++;
if(completion(h.id,d))successByDow[weekday(d)]++}}for(const h of activeHabits())for(const c of state.completions.filter(x=>x.habitId===h.id&&days.includes(x.date))){if(h.targetTime){const hr=String(h.targetTime).split(':')[0];
byHour[hr]=(byHour[hr]||0)+1}}return shell(`${pageHead('Carte de constance','Constance','Ici, on cherche les moments où tes routines tiennent le mieux.')}<div class="grid grid-2"><div class="card"><h3>Par jour de semaine</h3>${['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map((d,i)=>{const pct=attemptByDow[i]?Math.round(successByDow[i]/attemptByDow[i]*100):0;return `<div class="row" style="margin-top:8px"><span class="grow">${d}</span><strong>${pct}%</strong></div>${progressBar(pct)}`}).join('')}</div><div class="card"><h3>Moments efficaces</h3>${Object.entries(byHour).sort((a,b)=>Number(a[0])-Number(b[0])).map(([h,n])=>`<div class="list-item"><span class="grow">${h}:00</span><span class="pill gold">${n} trace${n>1?'s':''}</span></div>`).join('')||'<p class="muted">Les horaires apparaîtront quand tes habitudes auront une heure cible.</p>'}</div></div><div style="height:14px"></div><div class="card card--gold"><span class="label">Chronologie alternative</span><h3>Deux façons de lire le même mois</h3><p>La carte te montre les points de constance par jour et par heure. Elle ne modifie aucune donnée et ne crée pas de score caché.</p></div>`)}
function innerWeather(){const s=state.completions.filter(c=>c.date>=dayOffset(6)&&c.date<=today()).length,focus=state.completions.filter(c=>c.category==='connaissance'&&c.date>=dayOffset(6)).length,energy=state.completions.filter(c=>c.category==='energie'&&c.date>=dayOffset(6)).length,repos=state.completions.filter(c=>c.category==='repos'&&c.date>=dayOffset(6)).length;
return{regularity:clamp(s/7*100,0,100),focus:clamp(focus*25,0,100),energy:clamp(energy*25,0,100),rest:clamp(repos*25,0,100)}}
function weatherLine(w){const avg=Math.round((w.regularity+w.focus+w.energy+w.rest)/4);
return avg>=75?'Ciel clair : le rythme tient bien.':avg>=45?'Nuages légers : le système garde une direction.':'Brouillard local : réduis la taille des prochaines actions.'}
function journalView(){return shell(`${pageHead('Chronique','Journal d’aventure','Les traces importantes restent lisibles, même quand la journée était banale.','<button class="btn gold" data-action="daily-note">+ Écrire</button>')}<div class="stack">${state.journal.map(j=>`<article class="card"><div class="row"><span class="label">${esc(j.type)}</span><span class="muted">${esc(fmtDate(j.date))}</span></div><h3>${esc(j.title)}</h3><p>${esc(j.body)}</p></article>`).join('')||'<div class="empty">Le journal est encore vide.</div>'}</div>`)}
function timelineView(){const a=window.__timelineA||7,b=window.__timelineB||14;
function windowStats(days,offset=0){let n=0,xp=0;
for(let i=offset;
i<offset+days;
i++){const d=dayOffset(i);
for(const c of state.completions.filter(x=>x.date===d))xp+=c.xp;
n+=state.completions.filter(x=>x.date===d).length+state.challengeCompletions.filter(x=>x.date===d).length+state.ritualCompletions.filter(x=>x.date===d).length}return{n,xp}}const cur=windowStats(a),prev=windowStats(a,a),compare=windowStats(b);
const rate=Math.round(cur.n/Math.max(1,a)*100);
const projected=Math.round(state.profile.xp+(cur.xp/Math.max(1,a))*30);
return shell(`${pageHead('Chronologie','Progression','Comparer des fenêtres réelles et garder l’“écho du futur” comme simple calcul de rythme.')}<div class="card"><div class="form-grid"><div class="field"><label>Fenêtre récente</label><select data-timeline="a"><option value="7" ${a===7?'selected':''}>7 jours</option><option value="14" ${a===14?'selected':''}>14 jours</option><option value="30" ${a===30?'selected':''}>30 jours</option></select></div><div class="field"><label>Fenêtre comparée</label><select data-timeline="b"><option value="14" ${b===14?'selected':''}>14 jours</option><option value="30" ${b===30?'selected':''}>30 jours</option><option value="60" ${b===60?'selected':''}>60 jours</option></select></div></div></div><div style="height:14px"></div><div class="grid grid-4">${statCard('Récent',cur.n,'traces')}${statCard('Période précédente',prev.n,'traces')}${statCard('Comparaison',compare.n,'traces')}${statCard('Cadence',`${rate}%`,'traces/jour')}</div><div style="height:14px"></div><div class="card card--gold"><span class="label">Écho du futur</span><h3>${projected} XP cumulés selon le rythme observé</h3><p>Projection arithmétique locale : elle prolonge une moyenne. Ce n’est ni une prédiction psychologique ni une promesse.</p></div>`)}
function labView(){return shell(`${pageHead('Atelier','Laboratoire de routine','Une expérience possède une hypothèse, une baseline, une mesure, des observations et une conclusion.','<button class="btn gold" data-action="new-lab">+ Nouvelle expérience</button>')}<div class="grid grid-2">${state.labs.map(l=>{const age=Math.max(1,daysBetween(l.startedAt,today())+1),pct=clamp(age/l.duration*100,0,100),current=labMetric(l),delta=l.baseline==null?null:current-l.baseline;return `<div class="card ${l.status==='active'?'card--gold':''}"><div class="row"><div class="grow"><span class="label">${l.status==='active'?'En cours':'Terminé'}</span><h3>${esc(l.name)}</h3></div><span class="pill">${Math.min(age,l.duration)}/${l.duration} jours</span></div>${progressBar(pct)}<p style="margin-top:8px"><strong>Hypothèse :</strong> ${esc(l.hypothesis)}</p><p><strong>Critère :</strong> ${esc(l.criterion)}</p><div class="grid grid-3"><div class="stat"><small>Baseline</small><strong>${l.baseline??'—'}</strong></div><div class="stat"><small>Actuel</small><strong>${current}</strong></div><div class="stat"><small>Écart</small><strong>${delta==null?'—':delta>0?'+'+delta:delta}</strong></div></div>${l.observations?.length?`<div class="stack" style="margin-top:10px">${l.observations.slice(-4).reverse().map(o=>`<div class="list-item"><span class="grow">${esc(o.text)}</span><small>${esc(fmtDate(o.at))}</small></div>`).join('')}</div>`:'<p class="muted">Aucune observation encore.</p>'}<p class="muted">${esc(l.result?.conclusion||'La conclusion sera produite à la clôture.')}</p><div class="row">${l.status==='active'?button('Mesurer maintenant','observe-lab',l.id,'small gold'):button('Revoir','observe-lab',l.id,'small')}${l.status==='active'&&age>=l.duration?button('Clore','finish-lab',l.id,'small gold'):''}</div></div>`}).join('')||'<div class="empty">Aucune expérience.</div>'}</div>`)}
function frictionView(){const rows=activeHabits().map(h=>{const eligible=Array.from({length:30},(_,i)=>dayOffset(i)).filter(d=>scheduled(h,d));
const done=eligible.filter(d=>completion(h.id,d)).length;
const rate=eligible.length?Math.round(done/eligible.length*100):0;
return{h,rate,friction:100-rate}}).sort((a,b)=>b.friction-a.friction);
return shell(`${pageHead('Diagnostic','Radar de friction','La friction est ici un indicateur mécanique : une habitude planifiée qui laisse souvent un jour vide.','<a class="btn" href="#/lab">Tester une solution</a>')}<div class="grid grid-2">${rows.map(r=>`<div class="card ${r.friction>=60?'card--gold':''}"><div class="row"><div class="grow"><span class="label">${esc(cat(r.h.category).name)}</span><h3>${esc(r.h.title)}</h3></div><span class="pill">${r.rate}%</span></div>${progressBar(r.rate)}<p style="margin-top:8px">${r.friction>=60?'Réduis la taille de l’action ou protège son déclencheur.':r.friction>=30?'Friction moyenne : garde le créneau stable.':'Le rythme tient correctement.'}</p><button class="small" data-action="friction-experiment" data-id="${r.h.id}">Créer un test</button></div>`).join('')}</div>`)}
function settingsView(){const st=state.game.settings,p=prefs();
return shell(`${pageHead('Réglages','Paramètres','Les données de jeu restent dans IndexedDB. localStorage ne garde que des préférences d’interface.')}<div class="grid grid-2"><div class="card"><span class="label">Interface</span><div class="field" style="margin-top:10px"><label>Thème</label><select id="theme"><option value="night" ${st.selectedTheme==='night'?'selected':''}>Nuit</option><option value="paper" ${st.selectedTheme==='paper'?'selected':''}>Papier</option></select></div><label class="chip" style="margin-top:10px"><input type="checkbox" id="contrast" ${st.highContrast?'checked':''}> Contraste renforcé</label><label class="chip" style="margin-top:8px"><input type="checkbox" id="motion" ${st.reducedMotion?'checked':''}> Réduire les animations</label></div><div class="card"><span class="label">Audio local</span><p>Quatre sons WAV sont embarqués. Aucun téléchargement.</p><label class="chip"><input type="checkbox" id="sound" ${(p.sound??st.sound)?'checked':''}> Activer le son</label><div class="field" style="margin-top:10px"><label>Volume</label><input id="volume" type="range" min="0" max="1" step="0.05" value="${Number(p.volume??st.volume??0.75)}"></div><button class="small" data-action="sound-test">Tester</button></div></div><div style="height:14px"></div><div class="card card--gold"><span class="label">Stockage</span><h3>IndexedDB multi-store · schéma ${SCHEMA_VERSION}</h3><p>${storageMode==='indexeddb'?'Toutes les données du jeu sont persistées localement avec transactions atomiques, validation et migrations explicites.':'Le stockage local n’est pas actif.'}</p><div class="row"><button class="small" data-action="reset-demo">Recharger la démo</button><button class="small danger" data-action="wipe">Effacer les données</button></div></div>`)}
function backupView(){return shell(`${pageHead('Coffre-fort','Import / export','Sauvegarde complète avec version de schéma, validation et migration.')}<div class="grid grid-2"><div class="card card--gold"><span class="label">Export</span><h3>Emporter ton monde</h3><p>Le JSON contient profil, habitudes, preuves, sous-étapes, quêtes, saison, événements, compagnons, équipements, rituels, laboratoires et journal.</p><button class="small gold" data-action="export">Exporter la sauvegarde</button></div><div class="card"><span class="label">Import</span><h3>Restaurer un monde</h3><p>Le fichier est migré et validé avant écriture. Une structure incorrecte ne remplace pas le monde actuel.</p><div class="field" style="margin-top:10px"><label for="import-file">Fichier JSON</label><input id="import-file" type="file" accept="application/json,.json"></div></div></div><div style="height:14px"></div><div class="card inset"><div class="grid grid-4">${statCard('Schéma',SCHEMA_VERSION,'version actuelle')}${statCard('Habitudes',state.habits.length,'enregistrées')}${statCard('Quêtes',state.questRuns.length,'instances')}${statCard('Stores',STORE_NAMES.length,'IndexedDB')}</div></div>`)}
function profileCreateView(){return shell(`${pageHead('Départ','Créer ton profil','Même monde. Nouveau départ.')}<form id="profile-form" class="card" style="max-width:680px"><div class="field"><label>Nom</label><input name="name" required maxlength="24" value="${esc(state.profile.name)}"></div><div class="field" style="margin-top:10px"><label>Titre initial</label><input name="title" maxlength="40" value="${esc(state.profile.title)}"></div><div class="row" style="margin-top:14px"><button class="gold" type="submit">Entrer dans le monde</button><a class="btn" href="#/dashboard">Garder le profil</a></div></form>`)}
function levelUpView(){const lv=levelFromXp(state.profile.xp);
return shell(`${pageHead('Ascension',`Niveau ${lv.level}`,'La progression vient des actions réellement enregistrées.')}<div class="card card--gold center" style="min-height:420px;flex-direction:column">${playerAvatarScene('xl')}<h2 style="font-size:42px">${lv.level}</h2><p>Nouvelle étape pour ${esc(state.profile.name)}.</p><div class="row"><span class="pill gold">${state.profile.coins} pièces</span><span class="pill">${state.game.unlockedRegions.length} régions</span></div><a class="btn gold" href="#/dashboard" style="margin-top:14px">Retour au camp</a></div>`)}
function unlockView(id){const r=REGIONS.find(x=>x.id===id);
if(!r)return shell(pageHead('Carte','Région inconnue','Cette trace pointe vers nulle part.'));
const open=state.game.unlockedRegions.includes(r.id),current=state.game.campaign.currentRegion===r.id;
return shell(`${pageHead('Déblocage',esc(r.name),esc(r.desc))}<div class="card ${open?'card--gold':'inset'}"><div class="row"><span class="identity-mark">${open?'✓':'•'}</span><span class="pill ${open?'green':'red'}">${open?(current?'Région actuelle':'Région ouverte'):`Niveau ${r.unlockLevel} requis`}</span></div><h2 style="margin-top:24px">${esc(r.name)}</h2><p>${esc(r.desc)}</p><div class="row" style="margin-top:18px">${open?button(current?'Actuelle':'Choisir','set-region',r.id,current?'small ghost':'small gold'):'<a class="btn ghost" href="#/map">Revenir à la carte</a>'}</div></div>`)}

function eventView(){const e=state.game.event,steps=['Première lumière','Deuxième passage','Troisième veille','Quatrième éclat','Lanterne finale'];
return shell(`${pageHead('Événement','La trace des lanternes','Un événement à cinq étapes, alimenté par des preuves locales.')}<div class="card card--gold"><div class="row"><div class="grow"><span class="label">Événement spécial</span><h2>La trace des lanternes</h2><p>Chaque journée qui contient au moins une vraie trace alimente une étape. Les dates restent sur cet appareil.</p></div><span class="identity-mark">${e.progress}/${e.target}</span></div><div class="lantern-track">${steps.map((label,i)=>`<div class="lantern ${e.progress>i?'lit':''}"><strong>${String(i+1).padStart(2,'0')}</strong><small>${esc(label)}</small></div>`).join('')}</div>${progressBar(e.progress/e.target*100)}<div class="row" style="margin-top:14px"><span class="pill gold">${e.progress}/${e.target}</span>${e.claimed?'<span class="pill green">Récompense récupérée</span>':e.progress>=e.target?button(`Réclamer · +${e.reward.xp} XP`,'event-claim','','small gold'):'<span class="muted">Encore quelques jours avec une trace.</span>'}</div></div><div style="height:18px"></div><div class="card"><span class="label">Preuves</span>${e.evidence.slice(-10).reverse().map(d=>`<div class="list-item"><span class="identity-mark">•</span><span class="grow">${esc(fmtDate(d))}</span><span class="pill">${esc(state.game.event.lastSource||'trace')}</span></div>`).join('')||'<p class="muted">Aucune preuve d’événement.</p>'}</div><div style="height:18px"></div><div class="grid grid-3">${NPCS.map(n=>`<article class="card"><div class="character-card"><div class="companion-avatar" aria-hidden="true">${modernInitials(n.name)}</div><div><strong>${esc(n.name)}</strong><div class="muted">${esc(n.role)}</div></div></div><p>${esc(n.message)}</p></article>`).join('')}</div>`) }

// === js/router.js ===
function pageFor(path){const p=path.split('/').filter(Boolean);if(!p.length)return dashboard();switch(p[0]){case'dashboard':return dashboard();case'today':return todayView();case'habits':if(p[1]==='new')return habitEditView();if(p[1]&&p[2]==='edit')return habitEditView(p[1]);if(p[1])return habitDetailView(p[1]);return habitsView();case'map':return mapView();case'quests':return questsView();case'challenges':return challengesView();case'rituals':return ritualsView();case'character':return characterView();case'companions':return companionsView();case'collection':return collectionView();case'rewards':return rewardsView();case'achievements':return achievementsView();case'stats':return statsView();case'consistency':return consistencyView();case'journal':return journalView();case'timeline':return timelineView();case'lab':return labView();case'friction':return frictionView();case'settings':return settingsView();case'backup':return backupView();case'profile':return p[1]==='create'?profileCreateView():dashboard();case'level-up':return levelUpView();case'unlock':return unlockView(p[1]);case'event':return eventView();default:return dashboard()}}
function routePath(){return(location.hash||'#/dashboard').slice(1).replace(/\/$/,'')||'/dashboard'}
function render(){const root=document.querySelector('#app-root');if(!root)return;applyPrefs();try{root.innerHTML=pageFor(routePath());bindView();bindGlobalNav();window.__HQ_RENDERED__=true}catch(error){window.__HQ_RENDERED__=false;console.error(error);root.innerHTML=`<div class="empty" style="margin:24px"><h2>Le camp a rencontré une erreur locale</h2><p>${esc(error.message||'Erreur inconnue')}</p><p>Les données ne quittent pas cet appareil.</p></div>`}}
function bindGlobalNav(){document.querySelectorAll('.desktop-nav a,.mobile-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===location.hash))}

// === js/services/controller.js ===
const MODAL_STATE={trigger:null,keydown:null};
function closeModal(restore=true){const root=document.querySelector('#modal-root');
const modal=root?.querySelector('[role=dialog]');
if(MODAL_STATE.keydown){document.removeEventListener('keydown',MODAL_STATE.keydown);
MODAL_STATE.keydown=null}if(root)root.innerHTML='';
const trigger=MODAL_STATE.trigger;
MODAL_STATE.trigger=null;
if(restore&&trigger&&typeof trigger.focus==='function')trigger.focus()}
function ensureFieldLabels(root=document){let n=0;
root.querySelectorAll?.('label').forEach(label=>{if(label.htmlFor||label.querySelector('input,select,textarea'))return;
const field=label.closest('.field');
if(!field)return;
const controls=field.querySelectorAll('input,select,textarea');
if(controls.length!==1)return;
const control=controls[0];
if(!control.id)control.id=`hq-field-${Date.now()}-${n++}`;
label.htmlFor=control.id})}
function snapshotState(){return JSON.parse(JSON.stringify(state))}
function bindView(){
  const q=s=>document.querySelector(s);
  ensureFieldLabels(document);
  const form=q('#habit-form');
  if(form)form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form), id=String(fd.get('id')||uid('h')), existing=state.habits.find(h=>h.id===id), difficulty=String(fd.get('difficulty')||'medium');
    const customXp=Number(fd.get('xp')||diffXp(difficulty));
    const data={id,title:String(fd.get('title')||'').trim(),desc:String(fd.get('desc')||'').trim(),category:String(fd.get('category')||CATEGORIES[0].id),difficulty,frequency:String(fd.get('frequency')||'daily'),days:[...document.querySelectorAll('input[name="days"]:checked')].map(x=>Number(x.value)),targetTime:String(fd.get('targetTime')||''),xp:clamp(customXp,5,100),importance:clamp(Number(fd.get('importance')||2),1,3),duration:clamp(Number(fd.get('duration')||10),1,240),notes:String(fd.get('notes')||'').trim(),icon:String(fd.get('icon')||cat(fd.get('category')).icon),color:String(fd.get('color')||cat(fd.get('category')).color),substeps:String(fd.get('substeps')||'').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,12).map((title,i)=>({id:existing?.substeps?.[i]?.id||uid('step'),title})),companionId:fd.get('companionId')||null,archived:existing?.archived||false,startDate:fd.get('startDate')||null,endDate:fd.get('endDate')||null,createdAt:existing?.createdAt||today()};
    if(!data.title)return showToast('Nom manquant','Donne un nom à cette quête.');
    if((data.frequency==='specific'||data.frequency==='weekly')&&!data.days.length)return showToast('Choisis des jours','Une fréquence ciblée a besoin d’au moins un jour.');
if(data.startDate&&data.endDate&&data.startDate>data.endDate)return showToast('Dates invalides','La date de fin doit être postérieure ou égale à la date de début.');
    const before=snapshotState();
if(existing)Object.assign(existing,data);
else state.habits.push(data);
try{await persist();
showToast(existing?'Quête modifiée':'Quête créée',data.title);
location.hash='#/habits'}catch(err){state=before;
showToast('Quête refusée',err.message||'Erreur locale.')}
  });
  const pf=q('#profile-form');
  if(pf)pf.addEventListener('submit',async e=>{e.preventDefault();
const fd=new FormData(pf);
const before=snapshotState();
const fresh=seededState();
fresh.profile.name=String(fd.get('name')||'Nova').trim().slice(0,24)||'Nova';
fresh.profile.title=String(fd.get('title')||'Éclaireur du quotidien').trim().slice(0,40)||'Éclaireur du quotidien';
fresh.profile.xp=0;
fresh.profile.coins=0;
fresh.profile.activeCompanionId=null;
fresh.habits=[];
fresh.completions=[];
fresh.substepCompletions=[];
fresh.challengeCompletions=[];
fresh.questRuns=[];
fresh.journal=[];
fresh.labs=[];
fresh.rituals=[];
fresh.ritualCompletions=[];
fresh.inventory=[];
fresh.game.rewardXp=[];
fresh.game.claimedRewards=[];
fresh.game.completedAchievements=[];
fresh.meta.demo=false;
state=fresh;
try{await persist();
showToast('Profil prêt','Le camp est à toi.');
location.hash='#/dashboard'}catch(err){state=before;
showToast('Profil refusé',err.message||'Erreur locale.')}});
  const search=q('[data-filter="habit-search"]'),filter=q('[data-filter="habit-category"]'),status=q('[data-filter="habit-status"]'),sort=q('[data-filter="habit-sort"]'),group=q('[data-filter="habit-group"]');
  if(search||filter||status||sort||group){const list=q('#habit-list'),renderList=()=>{if(!list)return;
let hs=state.habits.slice();
const term=(search?.value||'').toLowerCase();
const catId=filter?.value||'all';
const st=status?.value||'active';
hs=hs.filter(h=>(!term||(`${h.title} ${h.desc} ${h.notes}`).toLowerCase().includes(term))&&(catId==='all'||h.category===catId)&&(st==='all'||(st==='archived'?h.archived:!h.archived)));
const so=sort?.value||'title';
hs.sort((a,b)=>so==='xp'?b.xp-a.xp:so==='mastery'?mastery(b)-mastery(a):so==='duration'?Number(a.duration||0)-Number(b.duration||0):a.title.localeCompare(b.title,'fr'));
const by=group?.value||'none';
if(by==='none')list.innerHTML=hs.map(habitCard).join('')||'<div class="empty">Aucune habitude ne correspond.</div>';
else{const groups={};
for(const h of hs){const key=by==='category'?cat(h.category).name:momentBucket(h.targetTime);
(groups[key]??=[]).push(h)}list.innerHTML=Object.entries(groups).map(([key,items])=>`<section><div class="section-title"><h3>${esc(key)}</h3><span class="muted">${items.length} quête${items.length>1?'s':''}</span></div><div class="grid grid-2">${items.map(habitCard).join('')}</div></section>`).join('')||'<div class="empty">Aucune habitude ne correspond.</div>';
}};
[search,filter,status,sort,group].filter(Boolean).forEach(x=>{x.addEventListener('input',renderList);
x.addEventListener('change',renderList)});
renderList()}
  const theme=q('#theme'),contrast=q('#contrast'),motion=q('#motion'),sound=q('#sound'),volume=q('#volume');
  if(theme||contrast||motion||sound||volume){const apply=async()=>{const before=snapshotState();
const prefsValue={theme:theme?.value||'night',contrast:Boolean(contrast?.checked),motion:Boolean(motion?.checked),sound:Boolean(sound?.checked),volume:Number(volume?.value??0.75)};
state.game.settings.selectedTheme=prefsValue.theme;
state.game.settings.highContrast=prefsValue.contrast;
state.game.settings.reducedMotion=prefsValue.motion;
state.game.settings.sound=prefsValue.sound;
state.game.settings.volume=prefsValue.volume;
try{await persist();
localStorage.setItem(PREF_KEY,JSON.stringify(prefsValue));
applyPrefs()}catch(err){state=before;
showToast('Réglages non enregistrés',err.message||'Erreur locale.')}};
[theme,contrast,motion,sound,volume].filter(Boolean).forEach(x=>{x.addEventListener('change',apply);
x.addEventListener('input',apply)})}
  const importFile=q('#import-file');
if(importFile)importFile.addEventListener('change',async e=>{const file=e.target.files?.[0];
if(!file)return;
try{const raw=JSON.parse(await file.text());
const candidate=raw?.data&&raw.exportVersion?raw.data:raw;
const migrated=migrateState(candidate);
const valid=validateState(migrated);
if(!valid?.ok)throw new Error(valid.errors.join(' '));
const previous=snapshotState();
const summary=`
Profil : ${migrated.profile.name}
Habitudes : ${migrated.habits.length}
XP : ${migrated.profile.xp}
Niveau : ${levelFromXp(migrated.profile.xp).level}
Compagnons : ${migrated.companions.filter(c=>c.unlocked).length}/${migrated.companions.length}`;
if(!confirm(`Remplacer le monde actuel par cette sauvegarde ?${summary}`))return;
state=migrated;
seasonSync();
ensureQuestRuns();
unlockCompanions();
unlockRegions();
achievements();
refreshQuestLedger();
try{await persist(state)}catch(err){state=previous;
throw err}applyPrefs();
showToast('Sauvegarde restaurée','Le monde validé a remplacé le monde local.');
render()}catch(err){showToast('Import refusé',err.message||'Fichier invalide.')}finally{importFile.value=''}});
  document.querySelectorAll('[data-timeline]').forEach(el=>el.addEventListener('change',()=>{window[`__timeline${String(el.dataset.timeline).toUpperCase()}`]=Number(el.value);
render()}));
}

async function uncompleteRitual(runId){const run=state.ritualCompletions.find(x=>x.id===runId);
if(!run)return;
if(!confirm('Annuler cette expédition et retirer sa récompense ?'))return;
const ritual=state.rituals.find(r=>r.id===run.ritualId);
const stepIds=new Set((run.steps||[]).map(x=>x.habitId));
const rows=state.completions.filter(x=>x.source==='ritual'&&x.date===run.date&&stepIds.has(x.habitId));
for(const row of rows){const h=state.habits.find(x=>x.id===row.habitId);
const comp=h?.companionId&&state.companions.find(c=>c.id===h.companionId);
if(comp)comp.totalAffinity=Math.max(0,Number(comp.totalAffinity||0)-(comp.favorite===row.category?6:3))}const reward=run.rewardRef?rewardDelta(run.rewardRef,run.xp):{x:Number(run.xp||0),coins:Math.max(1,Math.round(Number(run.xp||0)/5)),row:null};
state.profile.xp=Math.max(0,state.profile.xp-reward.x);
state.profile.coins=Math.max(0,state.profile.coins-reward.coins);
if(reward.row)state.game.rewardXp=state.game.rewardXp.filter(x=>x!==reward.row);
state.completions=state.completions.filter(x=>!(x.source==='ritual'&&x.date===run.date&&stepIds.has(x.habitId)));
state.ritualCompletions=state.ritualCompletions.filter(x=>x.id!==runId);
achievements({reconcile:true});
unlockCompanions();
syncEventTrail();
seasonSync();
refreshQuestLedger();
await persist();
render();
showToast('Expédition annulée',ritual?.name||'La récompense a été retirée.')}

async function action(act,id){
  switch(act){
    case 'complete':return completeHabit(id);
    case 'uncomplete':return uncompleteHabit(id);
    case 'undo-ritual':return uncompleteRitual(id);
    case 'complete-challenge':return completeChallenge();
    case 'complete-ritual':return completeRitual(id);
    case 'claim-quest':return claimQuest(id);
    case 'claim-season-goal':return claimSeasonGoal(id);
    case 'claim-daily-treasure':return claimDailyTreasure();
    case 'event-claim':return claimEvent();
    case 'set-region':{const r=REGIONS.find(x=>x.id===id);
if(r&&state.game.unlockedRegions.includes(r.id)){state.game.campaign.currentRegion=r.id;
if(!state.game.campaign.exploredRegions.includes(r.id))state.game.campaign.exploredRegions.push(r.id);
await persist();
render();
showToast('Région choisie',r.name)}return}
    case 'friction-experiment':{const h=state.habits.find(x=>x.id===id);
if(!h)return;
const existing=state.labs.find(l=>l.status==='active'&&l.habitIds.includes(id));
if(existing){location.hash='#/lab';
render();
return}state.labs.unshift({id:uid('lab'),name:`Test : ${h.title}`,hypothesis:'Réduire la taille de cette action doit diminuer les jours laissés vides.',criterion:'Observer une hausse du taux de réalisation sur la fenêtre test.',habitIds:[id],duration:7,startedAt:today(),status:'active',baseline:null,observations:[],measurements:[]});
await persist();
location.hash='#/lab';
showToast('Test créé','Le laboratoire suit cette habitude pendant 7 jours.');
render();
return}
    case 'select-companion':{const c=state.companions.find(x=>x.id===id);
if(c?.unlocked){state.profile.activeCompanionId=id;
await persist();
render()}return}
    case 'set-companion-appearance':{const [cid,appearance]=String(id||'').split(':');
const c=state.companions.find(x=>x.id===cid);
if(c?.unlocked&&c.appearances.includes(appearance)){c.activeAppearance=appearance;
await persist();
render()}return}
    case 'set-accent':if(APPEARANCE_OPTIONS.accent.some(x=>x.id===id)){state.profile.appearance.accent=id;
await persist();
render()}return;
    case 'set-hair':if(APPEARANCE_OPTIONS.hair.some(x=>x.id===id)){state.profile.appearance.hair=id;
await persist();
render()}return;
    case 'set-outfit':if(APPEARANCE_OPTIONS.outfit.some(x=>x.id===id)){state.profile.appearance.outfit=id;
await persist();
render()}return;
    case 'set-title':{if(state.profile.unlockedTitles.includes(id)){const t=TITLE_OPTIONS.find(x=>x.id===id);
if(t){state.profile.title=t.name;
await persist();
render()}}return}
    case 'archive':{const h=state.habits.find(x=>x.id===id);
if(h){h.archived=!h.archived;
await persist();
showToast(h.archived?'Quête archivée':'Quête restaurée',h.title);
render()}return}
    case 'delete-habit':{const h=state.habits.find(x=>x.id===id);
if(!h)return;
if(!confirm('Archiver cette habitude ? Ses preuves historiques seront conservées.'))return;
h.archived=true;
await persist();
location.hash='#/habits';
return}
    case 'toggle-substep':{const [habitId,stepId]=String(id||'').split(':');
if(!habitId||!stepId)return;
const ex=state.substepCompletions.find(x=>x.substepId===stepId&&x.habitId===habitId&&x.date===today());
if(ex)state.substepCompletions=state.substepCompletions.filter(x=>x!==ex);
else state.substepCompletions.push({id:uid('sc'),substepId:stepId,date:today(),habitId});
await persist();
render();
return}
    case 'buy-reward':{const r=REWARDS.find(x=>x.id===id);
if(!r||state.game.claimedRewards.includes(id))return;
if(state.profile.coins<r.cost)return showToast('Pas assez de pièces','Les récompenses se construisent avec les preuves.');
state.profile.coins-=r.cost;
state.game.claimedRewards.push(id);
if(!state.inventory.includes(id))state.inventory.push(id);
if(id==='map-horizon'&&!state.game.unlockedRegions.includes('horizon'))state.game.unlockedRegions.push('horizon');
journalEntry('reward',r.name,`Récompense débloquée pour ${r.cost} pièces.`);
await persist();
playSound('reward');
showToast('Récompense forgée',r.name);
render();
return}
    case 'equip-reward':{const r=REWARDS.find(x=>x.id===id);
if(!r||!state.inventory.includes(id))return;
state.profile.equipped[r.slot]=state.profile.equipped[r.slot]===id?null:id;
await persist();
showToast(state.profile.equipped[r.slot]?'Objet équipé':'Objet retiré',r.name);
render();
return}
    case 'advance-lab':return advanceLab(id);
    case 'finish-lab':return finishLab(id);
    case 'observe-lab':return observeLab(id);
    case 'new-lab':showModal('Nouvelle expérience',labForm());
return;
    case 'new-ritual':showModal('Créer un rituel',ritualForm());
return;
    case 'archive-ritual':{const r=state.rituals.find(x=>x.id===id);
if(r){r.archived=!r.archived;
await persist();
render()}return}
    case 'delete-ritual':{const r=state.rituals.find(x=>x.id===id);
if(!r)return;
if(!confirm('Archiver ce rituel ? Son historique sera conservé.'))return;
r.archived=true;
await persist();
render();
return}
    case 'export':exportBackup();
return;
    case 'sound-test':playSound('complete');
showToast('Test audio','Le son est local.');
return;
    case 'daily-note':showModal('Note de victoire',`<form id="note-form"><div class="field"><label>Une ligne pour ton journal</label><textarea name="body" required placeholder="Ce qui a vraiment marché aujourd’hui..."></textarea></div><button class="small gold" type="submit">Ajouter au journal</button></form>`);
document.querySelector('#note-form')?.addEventListener('submit',async e=>{e.preventDefault();
const before=snapshotState();
const body=new FormData(e.currentTarget).get('body');
journalEntry('note','Note personnelle',String(body));
try{await persist();
closeModal(false);
render()}catch(err){state=before;
showToast('Note refusée',err.message||'Erreur locale.')}});
return;
    case 'reset-demo':if(confirm('Remettre le monde de démonstration ?')){state=seededState();
await persist();
render()}return;
    case 'wipe':if(confirm('Effacer toutes les données locales ? Les préférences d’interface seront également réinitialisées.')){const before=snapshotState();
const fresh=seededState();
state=fresh;
try{await persist();
try{localStorage.removeItem(PREF_KEY);
for(const key of LEGACY_PREF_KEYS)localStorage.removeItem(key)}catch{}location.hash='#/profile/create';
render()}catch(err){state=before;
showToast('Réinitialisation refusée',err.message||'Les données locales ont été conservées.')}}return;
    case 'close-modal':closeModal();
return;
  }
}
function avatarAssetPath(){const a=state.profile.appearance||{};
const hair=APPEARANCE_OPTIONS.hair.some(x=>x.id===a.hair)?a.hair:'short';
const outfit=APPEARANCE_OPTIONS.outfit.some(x=>x.id===a.outfit)?a.outfit:'traveler';
const accent=APPEARANCE_OPTIONS.accent.some(x=>x.id===a.accent)?a.accent:'amber';
return `assets/sprites/player/custom/${hair}-${outfit}-${accent}.svg`}
function labForm(){return `<form id="lab-form"><div class="field"><label>Nom</label><input required name="name" maxlength="48" placeholder="Ex. Matin sans téléphone"></div><div class="form-grid" style="margin-top:10px"><div class="field"><label>Durée</label><input required type="number" min="2" max="60" name="duration" value="7"></div><div class="field"><label>Mesure</label><select name="metric"><option value="traces">Nombre de traces</option><option value="mastery">Maîtrise moyenne</option><option value="days">Jours actifs</option></select></div></div><div class="field" style="margin-top:10px"><label>Hypothèse</label><textarea name="hypothesis" required placeholder="Une petite modification devrait rendre la routine plus facile."></textarea></div><div class="field" style="margin-top:10px"><label>Critère de lecture</label><input name="criterion" required placeholder="Au moins 4 traces sur 7 jours"></div><div class="field" style="margin-top:10px"><label>Habitudes observées</label>${activeHabits().map(h=>`<label class="chip"><input type="checkbox" name="habitIds" value="${h.id}"> ${esc(h.title)}</label>`).join('')}</div><button class="small gold" type="submit" style="margin-top:12px">Lancer l’expérience</button></form>`}
function ritualForm(){return `<form id="ritual-form"><div class="field"><label>Nom du rituel</label><input required name="name" maxlength="48" placeholder="Matin calme"></div><div class="field" style="margin-top:10px"><label>Description</label><input name="description" maxlength="100" placeholder="Une courte expédition pour lancer la journée."></div><div class="field" style="margin-top:10px"><label>Étapes</label>${activeHabits().map(h=>`<label class="chip"><input type="checkbox" name="habitIds" value="${h.id}"> ${esc(h.title)}</label>`).join('')}</div><div class="field" style="margin-top:10px"><label>Bonus XP</label><input type="number" name="bonusXp" min="0" max="100" value="25"></div><button class="small gold" type="submit" style="margin-top:12px">Créer l’expédition</button></form>`}
function showModal(title,body){closeModal(false);
const root=document.querySelector('#modal-root');
if(!root)return;
const trigger=document.activeElement;
const titleId=`hq-modal-title-${Date.now()}`;
root.innerHTML=`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="${titleId}"><div class="modal" tabindex="-1"><div class="modal__head"><h3 id="${titleId}">${esc(title)}</h3><button class="ghost" data-action="close-modal" aria-label="Fermer la fenêtre">×</button></div>${body}</div></div>`;
const backdrop=root.querySelector('.modal-backdrop'),modal=root.querySelector('.modal');
MODAL_STATE.trigger=trigger;
const focusables=()=>[...modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
MODAL_STATE.keydown=e=>{if(e.key==='Escape'){e.preventDefault();
closeModal();
return}if(e.key!=='Tab')return;
const items=focusables();
if(!items.length){e.preventDefault();
modal.focus();
return}const first=items[0],last=items[items.length-1];
if(e.shiftKey&&document.activeElement===first){e.preventDefault();
last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();
first.focus()}};
document.addEventListener('keydown',MODAL_STATE.keydown);
requestAnimationFrame(()=>focusables()[0]?.focus());
const lf=document.querySelector('#lab-form');
if(lf)lf.addEventListener('submit',async e=>{e.preventDefault();
const fd=new FormData(lf),habitIds=fd.getAll('habitIds');
if(!habitIds.length)return showToast('Choisis une variable','Le laboratoire a besoin d’une habitude.');
const before=snapshotState();
try{state.labs.unshift({id:uid('lab'),name:String(fd.get('name')).trim(),hypothesis:String(fd.get('hypothesis')).trim(),criterion:String(fd.get('criterion')).trim(),metric:String(fd.get('metric')||'traces'),habitIds,duration:clamp(Number(fd.get('duration')||7),2,60),startedAt:today(),status:'active',baseline:null,observations:[],measurements:[]});
await persist();
closeModal(false);
showToast('Expérience lancée','La baseline est enregistrée à la prochaine mesure.');
render()}catch(err){state=before;
showToast('Expérience refusée',err.message||'Erreur locale.')}});
const rf=document.querySelector('#ritual-form');
if(rf)rf.addEventListener('submit',async e=>{e.preventDefault();
const fd=new FormData(rf),habitIds=fd.getAll('habitIds');
if(habitIds.length<2)return showToast('Expédition trop courte','Choisis au moins deux étapes.');
const before=snapshotState();
try{state.rituals.push({id:uid('rit'),name:String(fd.get('name')).trim(),description:String(fd.get('description')||'').trim(),habitIds,bonusXp:clamp(fd.get('bonusXp')===''?25:Number(fd.get('bonusXp')),0,100),createdAt:today(),archived:false});
await persist();
closeModal(false);
showToast('Expédition créée',String(fd.get('name')));
render()}catch(err){state=before;
showToast('Expédition refusée',err.message||'Erreur locale.')}});
ensureFieldLabels(root)}
async function advanceLab(id){const l=state.labs.find(x=>x.id===id);
if(!l)return;
if(l.status!=='active')return;
const current=labMetric(l);
if(l.baseline==null)l.baseline=current;
l.measurements.push({id:uid('m'),at:today(),value:current});
l.observations.push({id:uid('o'),at:today(),text:`Mesure ${current}${l.metric==='mastery'?'%':' unités'}.`});
if(daysBetween(l.startedAt,today())+1>=l.duration)finishLabData(l);
await persist();
render()}
function labMetric(l){if(l.metric==='mastery'){const hs=l.habitIds.map(id=>state.habits.find(h=>h.id===id)).filter(Boolean);
return hs.length?Math.round(hs.reduce((n,h)=>n+mastery(h),0)/hs.length):0}if(l.metric==='days')return uniqueDatesBetween(Math.min(30,Math.max(1,daysBetween(l.startedAt,today())+1)),l.habitIds);
return l.habitIds.reduce((n,id)=>n+completedCount(id,Math.min(30,Math.max(1,daysBetween(l.startedAt,today())+1))),0)}
function finishLabData(l){const current=labMetric(l),baseline=Number(l.baseline||0),delta=current-baseline;
l.status='complete';
l.completedAt=today();
l.result={current,baseline,delta,conclusion:delta>0?'La mesure progresse sur la fenêtre observée.':delta<0?'La mesure baisse sur la fenêtre observée.':'La mesure reste stable sur la fenêtre observée.'}}
async function finishLab(id){const l=state.labs.find(x=>x.id===id);
if(!l||l.status!=='active')return;
if(daysBetween(l.startedAt,today())+1<l.duration)return showToast('Expérience encore ouverte',`Encore ${l.duration-(daysBetween(l.startedAt,today())+1)} jour(s).`);
if(l.baseline==null)l.baseline=labMetric(l);
finishLabData(l);
await persist();
showToast('Expérience clôturée','Résultat conservé localement.');
render()}
async function observeLab(id){return advanceLab(id)}
function exportBackup(){const payload={exportVersion:4,appVersion:APP_VERSION,schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),data:migrateState(JSON.parse(JSON.stringify(state)))};
const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
const url=URL.createObjectURL(blob),a=document.createElement('a');
a.href=url;
a.download=`habit-quest-backup-${today()}.json`;
document.body.appendChild(a);
a.click();
a.remove();
setTimeout(()=>URL.revokeObjectURL(url),1000);
showToast('Sauvegarde exportée','Le monde complet est dans le fichier JSON.')}
function avatarFromAppearance(){return avatarAssetPath()}

// === js/app.js ===
/* Habit Quest V4 bootstrap. All game state is local; no network is required. */
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b){e.preventDefault();Promise.resolve(action(b.dataset.action,b.dataset.id)).catch(error=>{console.error(error);showToast('Action refusée',error.message||'Erreur locale')});return}const pin=e.target.closest('[data-map-region]');if(pin){e.preventDefault();location.hash=`#/unlock/${pin.dataset.mapRegion}`}});
window.addEventListener('hashchange',render);
window.addEventListener('error',e=>{if(!window.__HQ_RENDERED__)console.error('boot error',e.error||e.message)});
window.__HABIT_QUEST__={version:APP_VERSION,schemaVersion:SCHEMA_VERSION,getStorageMode:()=>storageMode,getState:()=>state,persist,loadState,migrateState,seededState,validateState,completeHabit,completeChallenge,completeRitual,claimQuest,claimSeasonGoal,claimEvent,seasonSync,refreshQuestLedger,dbRead,dbWrite,clearPersist,render,avatarAssetPath};
(async function boot(){let degraded=false;let storageNotice='';try{state=await loadState()}catch(err){const message=String(err?.message||err);if(/IndexedDB|Lecture IndexedDB|Écriture IndexedDB|Ouverture IndexedDB|Effacement IndexedDB/i.test(message)){try{state=seededState();if(typeof localStorage!=='undefined'&&localStorageAvailable()){storageMode='localstorage';writeLocalState(state);degraded=true;storageNotice='Le stockage IndexedDB n’est pas disponible ici ; les données utilisent le stockage local du navigateur.'}else{storageMode='memory';degraded=true;storageNotice='Le stockage persistant n’est pas disponible ici ; cette session reste locale mais temporaire.'}console.warn(message)}catch(fallbackError){console.error(fallbackError);state=seededState();storageMode='memory';degraded=true;storageNotice='Le stockage persistant n’est pas disponible ici ; cette session reste locale mais temporaire.'}}else throw err}try{seasonSync();ensureQuestRuns();unlockCompanions();unlockRegions();achievements();checkTitles();refreshQuestLedger();syncEventTrail();if(storageMode!=='memory')await persist();document.getElementById('boot-fallback')?.remove();applyPrefs();render();if(degraded)showToast(storageMode==='localstorage'?'Mode stockage local':'Mode mémoire',storageNotice) }catch(err){console.error(err);const fb=document.getElementById('boot-fallback');if(fb)fb.innerHTML=`<div class="empty"><h2>Le monde local n’a pas pu démarrer</h2><p>${esc(err.message||'Erreur locale')}</p><p>Les données locales n’ont pas été écrasées.</p></div>`}})();

})();

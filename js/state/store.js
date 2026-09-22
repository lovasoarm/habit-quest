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

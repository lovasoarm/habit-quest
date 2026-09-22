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

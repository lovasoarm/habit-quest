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

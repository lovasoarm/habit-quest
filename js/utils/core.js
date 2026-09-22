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

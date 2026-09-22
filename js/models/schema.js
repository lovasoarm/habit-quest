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

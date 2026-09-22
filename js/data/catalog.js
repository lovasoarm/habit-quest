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


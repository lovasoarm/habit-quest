# Architecture V4

Habit Quest reste une SPA vanilla servie par un runtime classique (`js/app.bundle.js`). Les sources sont découpées par responsabilité : catalogue, schéma/migrations, helpers, état, stockage, gamification, vues, routeur et contrôleur.

## Persistance

IndexedDB utilise la base V4 `habit-quest-v4-db` avec 23 object stores métier. Le schéma logique courant est V8. Les anciennes bases V3/V2 sont lues au démarrage puis importées dans la base V4 sans suppression de la source historique.

Les écritures métier sont atomiques. Une validation profonde contrôle les types, bornes, références, dates, unicités et états dérivés avant écriture. En cas d'échec de transaction, le dernier état persisté reste la source de vérité en mémoire.

## Migrations

Les migrations logiques V1→V8 restent dans `js/state/store.js`. Le changement d'identité de base V3→V4 est un transfert de données de compatibilité, pas une réinitialisation.

## Runtime offline

Toutes les ressources applicatives sont locales. Le service worker V4 précache le release et signale ses échecs dans la console de diagnostic au lieu de les masquer.

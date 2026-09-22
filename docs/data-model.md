# Data model V4

Le modèle logique courant utilise `schemaVersion=8`.

## Entités

`profile`, `habits`, `completions`, `substeps`, `challenges`, `quests`, `companions`, `journal`, `labs`, `rituals`, `ritualRuns`, `rewards`, `inventory`, `campaign`, `achievements`, `events`, `seasons`, `settings`, `eventEvidence`, `seasonRuns`, `labObservations`, `rewardXp`.

## Invariants

- IDs uniques par entité.
- Dates métier au format ISO `YYYY-MM-DD`.
- Types et bornes validés avant écriture/import.
- Une habitude ne peut pas avoir deux preuves le même jour.
- Les fréquences `weekly` et `specific` exigent au moins un jour.
- Les références de compagnons, récompenses, quêtes et habitudes doivent exister.
- Le palier compagnon est dérivé de l'affinité par la même fonction dans migration et runtime.

## Reward ledger

`rewardXp` conserve le delta XP **et** le delta pièces d'une récompense afin de permettre les annulations exactes. Les anciennes entrées sans champ `coins` restent compatibles grâce à une valeur de repli déterministe.

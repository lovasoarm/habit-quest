# Design system — Habit Quest 4.1

Habit Quest 4.1 adopte une direction éditoriale moderne inspirée des portfolios numériques contemporains : espace généreux, typographie très expressive, surfaces calmes, bordures fines, navigation sticky et mouvements discrets.

## Principes

- Interface sans chrome editorial : pas d’ombres dures, cadres carrés ni `image-rendering: pixelated` dans l’interface applicative.
- Typographie : titres très grands, chasse serrée, micro-labels en capitales pour les métadonnées.
- Surfaces : fond ivoire, cartes blanches cassées, lignes grises fines, coins généreusement arrondis.
- Accent : lime acide utilisé pour les actions de progression et quelques états importants.
- Navigation : barre horizontale sticky desktop + navigation basse mobile.
- Identité : avatars et marqueurs principaux rendus en CSS, afin que le chrome UI ne dépende pas des sprites editorial historiques.
- Accessibilité : focus visible, réduction des animations, contraste élevé et progression ARIA.

Les illustrations et assets de l’ancien univers restent présents dans l’archive afin de préserver les données et références historiques ; la nouvelle couche `css/modern-ui.css` neutralise leur traitement editorial dans le chrome moderne.

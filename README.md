# Am’India — version principale « ornements indiens » v2 (affinage)

Site statique complet, sans dépendance ni build. C’est la version **v2** de
`amindia-ornements` : même identité (S-2 « ornements indiens », polices
indiennes, système d’ornements, couche devanagari), affinée suite à la revue
de design du 2026-11-08. La v1 (`../amindia-ornements`) est conservée
intacte ; les deux dossiers sont autonomes (médiathèque copiée, pas de lien
symbolique).

## Preview

- ouvrir `index.html` directement, ou
- `python3 -m http.server 8123 --directory .` puis
  http://127.0.0.1:8123/index.html

## Modifications v1 → v2 (toutes issues de la revue, aucune autre)

**Correctifs (P1)**
1. **Visionneuse respecte le filtre** : ouverte depuis la galerie filtrée,
   elle ne parcourt plus que les photos visibles (avant : le groupe entier
   de 40, y compris les photos filtrées). `main.js` — `visibleGroup()`.
2. **Contraste AA rétabli** sur les petites capitales dorées :
   `--gold-deep` #8A6D24 → **#6F5719** (4,17 → 5,1:1 sur sable) et
   `--saffron-dark` #C25E04 → **#AC5305** (4,29 → 4,7:1 sur blanc) —
   `.margin-label` des bandeaux sable et `.team-role` des 8 portraits.

**Affinages (P2)**
3. **Tiro au poids vrai** : h2/h3 et titres du journal passent de la graisse
   synthétique 700 (Tiro ne livre que 400) à **400**, décision prise sur
   comparaison rendue — les modulations graves/déliées de la lettre
   réapparaissent. La graisse synthétique reste assumée sur les plaques
   display : `brand-name`, `stat-number`, `footer-wordmark`, `team-name`.
4. **Mesure du journal** : `.entry p` 46 → **40 rem** (~70 caractères).
5. **Filet à lotus lisible** : affiché à sa taille naturelle **220 px**
   (au lieu de 160), traits du SVG 1,1 → 1,4.
6. **Visionneuse complétée** : compteur « n / total », balayage tactile
   (swipe), boutons de navigation plus contrastés (blanc 12 → 20 %).
7. **Note de pied de page** alignée sur le palier 88 % (était 66 %).

**Poli (P3)**
8. Légende du hero : 0,82 → 0,92 rem, voile bas du hero renforcé.
9. Marqueurs « à venir » : filigrane boteh discret — état transitoire
   assumé, plus une case d’erreur.
10. Journal : pastille d’année active (scrollspy) pendant la lecture.
11. Menu mobile : le défilement de la page est bloqué quand il est ouvert.
12. Hygiène : `theme-color` unifié, ajout `og:image` (relatif —
    **remplacer par une URL absolue au déploiement**, le domaine n’est pas
    connu ici), taille des h1 « journal/galerie » sortie des styles inline
    (`.page-hero__title--lg`).
13. **Vert adopté de « amindia qwen »** (décision utilisateur, 2026-11-08) :
    bandes et pied de page `#1E4641`, bande citation et chiffres `#275A54`,
    accents/bordures `#35786F`, voiles et ombres recalés sur la même famille
    (les anciens `#0E2B28` / `#143B37`, jugés trop sombres, ont disparu).
    Contraste AA revalidé : 20/20 paires.
14. **Ouverture directe du fichier corrigée** (double-clic sur
    `index.html`, sans serveur) : `mask-image` est une ressource soumise à
    CORS, bloquée en `file://` — le masque raté rendait son élément
    entièrement transparent (la photo sous l’arche disparaissait, les
    textures jali/kolam/lotus aussi). Les cinq ornements masquants sont
    désormais **inlinés en `data:` URI** dans le CSS (aucun fetch, rendu
    identique partout ; régénérer depuis `media/ornaments/*.svg` si vous
    les modifiez). Bonus : trois requêtes réseau en moins.

## Non modifié (volontairement)

- Textes, photos, vidéos, liens, ancres, filtres : inchangés (parité
  mot à mot vérifiée contre la v1 : 0 mot perdu).
- Les trois styles inline de mise en page ponctuelle (rythme du journal,
  galerie, panneau don) : choix du designer d’origine, conservés.
- Les marqueurs « Photo/Vidéo à venir » : contenu associatif, pas de
  photos dans aucune source.

## Vérification (à la livraison)

- Intégrité des ressources : chaque `src`, `href` et `url()` CSS résout —
  0 lien rompu.
- Parité de contenu : diff mot à mot des cinq pages contre la v1 —
  aucune perte, aucun ajout de texte visible.
- Contraste : 19/19 paires WCAG AA (les deux échecs v1 corrigés).
- `node --check assets/js/main.js` : OK.
- Rendu Playwright des 5 pages à 1440/768/390 px : aucune erreur console,
  aucune requête en échec, aucune image cassée, aucun débordement,
  visionneuse filtrée (groupe = photos visibles), compteur, scrollspy,
  verrou de défilement du menu — tout vérifié.

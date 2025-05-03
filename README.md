# Data Flow Demo

Ce projet illustre un pipeline de données complet, de la source brute jusqu'à la visualisation dans Power BI, en passant par les couches Bronze, Silver, Gold et le modèle sémantique.

## Architecture du flux de données

\`\`\`mermaid
graph LR
    A["Sources"] --> B["Bronze"]
    B --> C["Silver"]
    C --> D["Gold"]
    D --> E["Modèle sémantique"]
    E --> F["Power BI"]
    
    subgraph "Sources"
    A1["CSV"] 
    A2["API REST"]
    A3["Excel"]
    end
    
    subgraph "Couche Bronze"
    B1["Nettoyage"]
    B2["Encodage UTF-8"]
    B3["Séparateurs normalisés"]
    end
    
    subgraph "Couche Silver"
    C1["Typage correct"]
    C2["Colonnes normalisées"]
    C3["Données structurées"]
    end
    
    subgraph "Couche Gold"
    D1["Vues agrégées"]
    D2["Métriques calculées"]
    D3["Données analytiques"]
    end
    
    subgraph "Modèle sémantique"
    E1["Tables Fact/Dim"]
    E2["Relations"]
    E3["Mesures DAX"]
    end
    
    subgraph "Power BI"
    F1["Rapports"]
    F2["Tableaux de bord"]
    F3["Visualisations"]
    end
\`\`\`

## Installation

1. Clonez ce dépôt :
\`\`\`bash
git clone https://github.com/votre-utilisateur/data-flow-demo.git
cd data-flow-demo
\`\`\`

2. Installez les dépendances :
\`\`\`bash
npm install
\`\`\`

3. Lancez l'application en mode développement :
\`\`\`bash
npm run dev
\`\`\`

4. Ouvrez votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173)

## Fonctionnalités

- **Diagramme interactif** : Visualisez le flux de données à travers les différentes couches
- **Animation des flux** : Les flèches sont animées pour représenter le flux continu des données
- **Panneau d'information** : Cliquez sur un nœud pour voir sa description, son schéma et un aperçu des données
- **Sources multiples** : Explorez différents types de sources de données (CSV, API REST, Excel)
- **Mode démonstration** : Lancez une démonstration automatique qui active chaque nœud séquentiellement
- **Terminal de logs** : Suivez les opérations en temps réel dans un terminal intégré
- **Intégration Power BI** : Visualisez un rapport Power BI intégré (nécessite un token d'accès)

## Obtention d'un token Power BI

Pour afficher le rapport Power BI intégré, vous devez obtenir un token d'accès :

1. Connectez-vous au [portail Power BI](https://app.powerbi.com)
2. Créez un rapport ou utilisez un rapport existant
3. Allez dans les paramètres du rapport > Intégration
4. Générez un token d'accès
5. Remplacez le token dans le fichier `src/services/api.ts`

## Structure du projet

- `src/components/` : Composants React de l'application
- `src/store/` : Gestion de l'état global avec Zustand
- `src/services/` : Services pour les appels API
- `src/mock/` : Données d'exemple

## Technologies utilisées

- **React** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite** : Outil de build
- **React Flow** : Diagramme interactif
- **Framer Motion** : Animations
- **Tailwind CSS** : Styles
- **Zustand** : Gestion d'état
- **Power BI Client** : Intégration Power BI

## Couches de données

### Source brute
Données non structurées provenant de différentes sources (CSV, API, Excel).

### Bronze
Données brutes mais nettoyées : encodage uniforme, séparateurs normalisés.

### Silver
Données avec typage correct et colonnes normalisées.

### Gold
Vues agrégées et métriques calculées pour l'analyse.

### Modèle sémantique
Structure relationnelle avec tables de faits, dimensions et mesures.

### Power BI
Visualisations et tableaux de bord interactifs.

## Licence

Ce projet est sous licence MIT.

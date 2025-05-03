// Schémas pour chaque couche de données
const schemas = {
  source: {
    habous: {
      type: "file",
      format: "XLSX",
      sheet: "Eleve",
      fields: [
        { name: "annee_scolaire_title", type: "string" },
        { name: "id_etudiant", type: "integer" },
        { name: "id_personne", type: "integer" },
        { name: "CIN", type: "string" },
        { name: "Code massar", type: "string" },
        { name: "nom_arabe", type: "string" },
        { name: "prenom_arabe", type: "string" },
        { name: "genre", type: "string" },
        { name: "id_nationalite", type: "integer" },
        { name: "id_etablissement", type: "integer" },
        { name: "type inscription", type: "string" },
        { name: "Résultat", type: "string" },
        { name: "mention", type: "string" }
      ]
    },
    men: {
      type: "file",
      format: "XLSX",
      sheet: "Eleve",
      fields: [
        { name: "id_eleve", type: "integer" },
        { name: "Code massar", type: "string" },
        { name: "milieu", type: "string" },
        { name: "Decision", type: "string" },
        { name: "id_annee_scolaire", type: "string" }
      ]
    },
    esup: {
      type: "file",
      format: "XLSX",
      sheet: "Eleve",
      fields: [
        { name: "id_eleve", type: "integer" },
        { name: "Code massar", type: "string" },
        { name: "Decision", type: "string" },
        { name: "id_annee_scolaire", type: "string" },
        { name: "Cycle", type: "string" }
      ]
    },
    ofppt: {
      type: "file",
      format: "XLSX",
      sheet: "Eleve",
      fields: [
        { name: "id_eleve", type: "integer" },
        { name: "Code massar", type: "string" },
        { name: "Decision", type: "string" },
        { name: "id_annee_scolaire", type: "string" },
        { name: "Cycle", type: "string" }
      ]
    }
  },
  bronze: {
    type: "table",
    format: "CSV",
    encoding: "UTF-8",
    separator: ",",
    fields: [
      { name: "id", type: "string" },
      { name: "code_massar", type: "string" },
      { name: "nom", type: "string" },
      { name: "prenom", type: "string" },
      { name: "genre", type: "string" },
      { name: "result", type: "string" },
      { name: "source", type: "string" },
      { name: "date_import", type: "string" },
    ],
  },
  silver: {
    type: "table",
    format: "Parquet",
    fields: [
      { name: "id", type: "integer" },
      { name: "code_massar", type: "string" },
      { name: "nom", type: "string" },
      { name: "prenom", type: "string" },
      { name: "genre", type: "string" },
      { name: "result", type: "string" },
      { name: "source", type: "string" },
      { name: "date_import", type: "date" },
      { name: "annee_scolaire", type: "string" },
      { name: "cycle", type: "string" },
    ],
  },
  gold: {
    type: "views",
    format: "SQL Views",
    views: [
      {
        name: "moyenne_par_source",
        fields: [
          { name: "source", type: "string" },
          { name: "nombre_admis", type: "integer" },
          { name: "nombre_redoublants", type: "integer" },
          { name: "pourcentage_succes", type: "float" },
          { name: "nombre_etudiants", type: "integer" },
        ],
      },
      {
        name: "analyse_par_genre",
        fields: [
          { name: "genre", type: "string" },
          { name: "nombre_admis", type: "integer" },
          { name: "nombre_redoublants", type: "integer" },
          { name: "pourcentage_succes", type: "float" },
          { name: "nombre_etudiants", type: "integer" },
        ],
      },
      {
        name: "repartition_cycle",
        fields: [
          { name: "cycle", type: "string" },
          { name: "nombre_admis", type: "integer" },
          { name: "nombre_redoublants", type: "integer" },
          { name: "pourcentage_etudiants", type: "float" },
        ],
      },
    ],
  },
  semantic: {
    type: "model",
    format: "Semantic Model",
    tables: [
      {
        name: "DimEleves",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "code_massar", type: "string" },
          { name: "nom", type: "string" },
          { name: "prenom", type: "string" },
          { name: "genre", type: "string" },
          { name: "source_id", type: "integer", key: "foreign" },
          { name: "cycle_id", type: "integer", key: "foreign" },
        ],
      },
      {
        name: "DimSources",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "nom", type: "string" },
          { name: "description", type: "string" },
          { name: "partneraire", type: "string" },
        ],
      },
      {
        name: "DimCycles",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "nom", type: "string" },
          { name: "niveau", type: "string" },
          { name: "categorie", type: "string" },
        ],
      },
      {
        name: "FactResultats",
        type: "fact",
        fields: [
          { name: "eleve_id", type: "integer", key: "foreign" },
          { name: "resultat", type: "string" },
          { name: "annee_scolaire", type: "string" },
          { name: "date_import", type: "date" },
        ],
      },
    ],
    measures: [
      {
        name: "Taux de Réussite",
        expression: "DIVIDE(COUNTX(FILTER(FactResultats, FactResultats[resultat] IN {\"Admis\", \"Passe\", \"Poursuit\"}), FactResultats[eleve_id]), DISTINCTCOUNT(FactResultats[eleve_id]))",
        format: "percentage",
        description: "Pourcentage d'élèves ayant réussi",
      },
      {
        name: "Taux de Redoublement",
        expression: "DIVIDE(COUNTX(FILTER(FactResultats, FactResultats[resultat] IN {\"Redouble\", \"Redoublant\"}), FactResultats[eleve_id]), DISTINCTCOUNT(FactResultats[eleve_id]))",
        format: "percentage",
        description: "Pourcentage d'élèves redoublants",
      },
      {
        name: "Nombre d'Élèves",
        expression: "DISTINCTCOUNT(DimEleves[id])",
        format: "whole",
        description: "Nombre total d'élèves",
      },
    ],
  },
  powerbi: {
    type: "report",
    reportId: "bac-2024-analysis",
    embedUrl: "https://app.powerbi.com/reportEmbed",
    datasetId: "bac-2024-dataset",
  },
}

// Données simulées pour chaque couche
const mockData = {
  source: {
    habous: [
      {
        annee_scolaire_title: "2024-2025",
        id_etudiant: 12,
        Code_massar: "M392227662",
        genre: "M",
        Résultat: "Admis"
      },
      {
        annee_scolaire_title: "2023-2024",
        id_etudiant: 25,
        Code_massar: "M447009225",
        genre: "F",
        Résultat: "Redoublant"
      },
      {
        annee_scolaire_title: "2023-2024",
        id_etudiant: 38,
        Code_massar: "M167018309",
        genre: "F",
        Résultat: "Admis"
      },
      {
        annee_scolaire_title: "2022-2023",
        id_etudiant: 57,
        Code_massar: "M669619838",
        genre: "M",
        Résultat: "Admis"
      },
      {
        annee_scolaire_title: "2024-2025",
        id_etudiant: 66,
        Code_massar: "M227345480",
        genre: "F",
        Résultat: "Admis"
      }
    ],
    men: [
      {
        id_eleve: 1,
        Code_massar: "M880112334",
        milieu: "urbain",
        Decision: "Passe",
        id_annee_scolaire: "2023-2024"
      },
      {
        id_eleve: 2,
        Code_massar: "M447009225",
        milieu: "rural",
        Decision: "Redouble",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 3,
        Code_massar: "M227345480",
        milieu: "urbain",
        Decision: "Passe",
        id_annee_scolaire: "2022-2023"
      },
      {
        id_eleve: 4,
        Code_massar: "M669619838",
        milieu: "urbain",
        Decision: "Redouble",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 5,
        Code_massar: "M167018309",
        milieu: "rural",
        Decision: "Passe",
        id_annee_scolaire: "2023-2024"
      }
    ],
    esup: [
      {
        id_eleve: 15,
        Code_massar: "M112334556",
        Decision: "Poursuit",
        Cycle: "Licence",
        id_annee_scolaire: "2023-2024"
      },
      {
        id_eleve: 44,
        Code_massar: "M554433221",
        Decision: "Redouble",
        Cycle: "Master",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 77,
        Code_massar: "M667788990",
        Decision: "Poursuit",
        Cycle: "Doctorat",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 81,
        Code_massar: "M220011334",
        Decision: "Redouble",
        Cycle: "Licence",
        id_annee_scolaire: "2022-2023"
      },
      {
        id_eleve: 102,
        Code_massar: "M559900887",
        Decision: "Poursuit",
        Cycle: "Master",
        id_annee_scolaire: "2023-2024"
      }
    ],
    ofppt: [
      {
        id_eleve: 101,
        Code_massar: "M123456789",
        Decision: "Redouble",
        Cycle: "Technicien",
        id_annee_scolaire: "2023-2024"
      },
      {
        id_eleve: 245,
        Code_massar: "M667788990",
        Decision: "Poursuit",
        Cycle: "T. Spécialisé",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 380,
        Code_massar: "M445566221",
        Decision: "Poursuit",
        Cycle: "Qualification",
        id_annee_scolaire: "2024-2025"
      },
      {
        id_eleve: 512,
        Code_massar: "M221199884",
        Decision: "Redouble",
        Cycle: "Technicien",
        id_annee_scolaire: "2022-2023"
      },
      {
        id_eleve: 700,
        Code_massar: "M990011223",
        Decision: "Poursuit",
        Cycle: "Technicien",
        id_annee_scolaire: "2024-2025"
      }
    ]
  },
  bronze: [
    {
      id: "1",
      code_massar: "M392227662",
      nom: "Eleve1",
      prenom: "Prenom1",
      genre: "M",
      result: "Admis",
      source: "Habous",
      date_import: "2024-06-15",
    },
    {
      id: "2",
      code_massar: "M447009225",
      nom: "Eleve2",
      prenom: "Prenom2",
      genre: "F",
      result: "Redoublant",
      source: "Habous",
      date_import: "2024-06-15",
    },
    {
      id: "3",
      code_massar: "M880112334",
      nom: "Eleve3",
      prenom: "Prenom3",
      genre: "M",
      result: "Passe",
      source: "MEN",
      date_import: "2024-06-15",
    },
    {
      id: "4",
      code_massar: "M227345480",
      nom: "Eleve4",
      prenom: "Prenom4",
      genre: "F",
      result: "Passe",
      source: "MEN",
      date_import: "2024-06-15",
    },
    {
      id: "5",
      code_massar: "M112334556",
      nom: "Eleve5",
      prenom: "Prenom5",
      genre: "M",
      result: "Poursuit",
      source: "ESUP",
      date_import: "2024-06-15",
    },
    {
      id: "6",
      code_massar: "M554433221",
      nom: "Eleve6",
      prenom: "Prenom6",
      genre: "F",
      result: "Redouble",
      source: "ESUP",
      date_import: "2024-06-15",
    },
    {
      id: "7",
      code_massar: "M123456789",
      nom: "Eleve7",
      prenom: "Prenom7",
      genre: "M",
      result: "Redouble",
      source: "OFPPT",
      date_import: "2024-06-15",
    },
    {
      id: "8",
      code_massar: "M667788990",
      nom: "Eleve8",
      prenom: "Prenom8",
      genre: "F",
      result: "Poursuit",
      source: "OFPPT",
      date_import: "2024-06-15",
    },
  ],
  silver: [
    {
      id: 1,
      code_massar: "M392227662",
      nom: "Eleve1",
      prenom: "Prenom1",
      genre: "M",
      result: "Admis",
      source: "Habous",
      date_import: "2024-06-15",
      annee_scolaire: "2024-2025",
      cycle: ""
    },
    {
      id: 2,
      code_massar: "M447009225",
      nom: "Eleve2",
      prenom: "Prenom2",
      genre: "F",
      result: "Redoublant",
      source: "Habous",
      date_import: "2024-06-15",
      annee_scolaire: "2023-2024",
      cycle: ""
    },
    {
      id: 3,
      code_massar: "M880112334",
      nom: "Eleve3",
      prenom: "Prenom3",
      genre: "M",
      result: "Passe",
      source: "MEN",
      date_import: "2024-06-15",
      annee_scolaire: "2023-2024",
      cycle: ""
    },
    {
      id: 4,
      code_massar: "M112334556",
      nom: "Eleve5",
      prenom: "Prenom5",
      genre: "M",
      result: "Poursuit",
      source: "ESUP",
      date_import: "2024-06-15",
      annee_scolaire: "2023-2024",
      cycle: "Licence"
    },
    {
      id: 5,
      code_massar: "M554433221",
      nom: "Eleve6",
      prenom: "Prenom6",
      genre: "F",
      result: "Redouble",
      source: "ESUP",
      date_import: "2024-06-15",
      annee_scolaire: "2024-2025",
      cycle: "Master"
    },
    {
      id: 6,
      code_massar: "M123456789",
      nom: "Eleve7",
      prenom: "Prenom7",
      genre: "M",
      result: "Redouble",
      source: "OFPPT",
      date_import: "2024-06-15",
      annee_scolaire: "2023-2024",
      cycle: "Technicien"
    },
    {
      id: 7,
      code_massar: "M667788990",
      nom: "Eleve8",
      prenom: "Prenom8",
      genre: "F",
      result: "Poursuit",
      source: "OFPPT",
      date_import: "2024-06-15",
      annee_scolaire: "2024-2025",
      cycle: "T. Spécialisé"
    },
  ],
  gold: {
    moyenne_par_source: [
      { source: "Habous", nombre_admis: 1, nombre_redoublants: 1, pourcentage_succes: 50, nombre_etudiants: 2 },
      { source: "MEN", nombre_admis: 2, nombre_redoublants: 0, pourcentage_succes: 100, nombre_etudiants: 2 },
      { source: "ESUP", nombre_admis: 1, nombre_redoublants: 1, pourcentage_succes: 50, nombre_etudiants: 2 },
      { source: "OFPPT", nombre_admis: 1, nombre_redoublants: 1, pourcentage_succes: 50, nombre_etudiants: 2 },
    ],
    analyse_par_genre: [
      { genre: "M", nombre_admis: 2, nombre_redoublants: 2, pourcentage_succes: 50, nombre_etudiants: 4 },
      { genre: "F", nombre_admis: 3, nombre_redoublants: 1, pourcentage_succes: 75, nombre_etudiants: 4 },
    ],
    repartition_cycle: [
      { cycle: "", nombre_admis: 3, nombre_redoublants: 1, pourcentage_etudiants: 50 },
      { cycle: "Licence", nombre_admis: 1, nombre_redoublants: 0, pourcentage_etudiants: 12.5 },
      { cycle: "Master", nombre_admis: 0, nombre_redoublants: 1, pourcentage_etudiants: 12.5 },
      { cycle: "Technicien", nombre_admis: 0, nombre_redoublants: 1, pourcentage_etudiants: 12.5 },
      { cycle: "T. Spécialisé", nombre_admis: 1, nombre_redoublants: 0, pourcentage_etudiants: 12.5 },
    ],
  },
  semantic: {
    tables: [
      { name: "DimEleves", rows: 15, columns: 7 },
      { name: "DimSources", rows: 4, columns: 4 },
      { name: "DimCycles", rows: 5, columns: 4 },
      { name: "FactResultats", rows: 25, columns: 4 },
    ],
    relationships: [
      {
        fromTable: "FactResultats",
        fromColumn: "eleve_id",
        toTable: "DimEleves",
        toColumn: "id",
        type: "many-to-one",
      },
      { fromTable: "DimEleves", fromColumn: "source_id", toTable: "DimSources", toColumn: "id", type: "many-to-one" },
      { fromTable: "DimEleves", fromColumn: "cycle_id", toTable: "DimCycles", toColumn: "id", type: "many-to-one" },
    ],
    measures: [
      { name: "Taux de Réussite", value: 0.67 },
      { name: "Taux de Redoublement", value: 0.33 },
      { name: "Nombre d'Élèves", value: 15 },
    ],
  },
}

// Fonction pour récupérer les données d'un nœud
export const fetchNodeData = async (nodeId: string, sourceType: string | null = null) => {
  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (nodeId === "source" && sourceType) {
    return {
      schema: schemas.source[sourceType as keyof typeof schemas.source],
      data: mockData.source[sourceType as keyof typeof mockData.source],
    }
  }

  if (nodeId === "gold") {
    // Pour Gold, on retourne une des vues agrégées
    return {
      schema: schemas.gold,
      data: mockData.gold.moyenne_par_source,
    }
  }

  if (nodeId === "semantic") {
    // Pour le modèle sémantique, on retourne la structure du modèle
    return {
      schema: schemas.semantic,
      data: mockData.semantic.tables,
    }
  }

  // Pour les autres nœuds, on retourne les données correspondantes
  return {
    schema: schemas[nodeId as keyof typeof schemas],
    data: mockData[nodeId as keyof typeof mockData],
  }
}

// Fonction pour récupérer la configuration Power BI
export const fetchPowerBIConfig = async () => {
  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Dans un environnement réel, cette configuration viendrait d'une API
  return {
    reportId: "bac-2024-analysis",
    embedUrl: "https://app.powerbi.com/reportEmbed",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXBvcnRJZCI6ImJhYy0yMDI0LWFuYWx5c2lzIiwidXNlcklkIjoiZGVtbyIsImlhdCI6MTYxNjc2MzIwMH0.EXAMPLE_TOKEN",
    tokenType: 1,
    permissions: 0,
  }
}

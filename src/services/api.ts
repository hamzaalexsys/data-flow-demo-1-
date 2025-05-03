// Schémas pour chaque couche de données
const schemas = {
  source: {
    csv: {
      type: "file",
      format: "CSV",
      encoding: "mixed",
      separator: ";",
      fields: [
        { name: "id", type: "string" },
        { name: "Nom", type: "string" },
        { name: "Prénom", type: "string" },
        { name: "NoteMath", type: "string" },
        { name: "NotePhysique", type: "string" },
        { name: "Ville", type: "string" },
        { name: "DateNaissance", type: "string" },
      ],
    },
    api: {
      type: "api",
      format: "JSON",
      endpoint: "/api/students",
      authentication: "Bearer token",
      fields: [
        { name: "id", type: "string" },
        { name: "name", type: "string" },
        { name: "firstName", type: "string" },
        { name: "mathGrade", type: "string" },
        { name: "physicsGrade", type: "string" },
        { name: "city", type: "string" },
        { name: "birthDate", type: "string" },
      ],
    },
    excel: {
      type: "file",
      format: "Excel",
      sheets: ["Étudiants", "Notes", "Villes"],
      fields: [
        { name: "ID", type: "string" },
        { name: "NOM", type: "string" },
        { name: "PRENOM", type: "string" },
        { name: "NOTE_MATH", type: "string" },
        { name: "NOTE_PHYSIQUE", type: "string" },
        { name: "VILLE", type: "string" },
        { name: "DATE_NAISSANCE", type: "string" },
      ],
    },
  },
  bronze: {
    type: "table",
    format: "CSV",
    encoding: "UTF-8",
    separator: ",",
    fields: [
      { name: "id", type: "string" },
      { name: "nom", type: "string" },
      { name: "prenom", type: "string" },
      { name: "note_math", type: "string" },
      { name: "note_physique", type: "string" },
      { name: "ville", type: "string" },
      { name: "date_naissance", type: "string" },
    ],
  },
  silver: {
    type: "table",
    format: "Parquet",
    fields: [
      { name: "id", type: "integer" },
      { name: "nom", type: "string" },
      { name: "prenom", type: "string" },
      { name: "note_math", type: "float" },
      { name: "note_physique", type: "float" },
      { name: "ville", type: "string" },
      { name: "date_naissance", type: "date" },
      { name: "sexe", type: "string" },
    ],
  },
  gold: {
    type: "views",
    format: "SQL Views",
    views: [
      {
        name: "moyenne_par_ville",
        fields: [
          { name: "ville", type: "string" },
          { name: "moyenne_math", type: "float" },
          { name: "moyenne_physique", type: "float" },
          { name: "moyenne_generale", type: "float" },
          { name: "nombre_etudiants", type: "integer" },
        ],
      },
      {
        name: "moyenne_par_sexe",
        fields: [
          { name: "sexe", type: "string" },
          { name: "moyenne_math", type: "float" },
          { name: "moyenne_physique", type: "float" },
          { name: "moyenne_generale", type: "float" },
          { name: "nombre_etudiants", type: "integer" },
        ],
      },
      {
        name: "distribution_notes",
        fields: [
          { name: "tranche_note", type: "string" },
          { name: "nombre_math", type: "integer" },
          { name: "nombre_physique", type: "integer" },
          { name: "pourcentage_math", type: "float" },
          { name: "pourcentage_physique", type: "float" },
        ],
      },
    ],
  },
  semantic: {
    type: "model",
    format: "Semantic Model",
    tables: [
      {
        name: "DimEtudiants",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "nom", type: "string" },
          { name: "prenom", type: "string" },
          { name: "date_naissance", type: "date" },
          { name: "sexe", type: "string" },
          { name: "ville_id", type: "integer", key: "foreign" },
        ],
      },
      {
        name: "DimVilles",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "nom", type: "string" },
          { name: "region", type: "string" },
          { name: "academie", type: "string" },
        ],
      },
      {
        name: "FactNotes",
        type: "fact",
        fields: [
          { name: "etudiant_id", type: "integer", key: "foreign" },
          { name: "matiere_id", type: "integer", key: "foreign" },
          { name: "note", type: "float" },
          { name: "annee", type: "integer" },
        ],
      },
      {
        name: "DimMatieres",
        type: "dimension",
        fields: [
          { name: "id", type: "integer", key: "primary" },
          { name: "nom", type: "string" },
          { name: "coefficient", type: "float" },
        ],
      },
    ],
    measures: [
      {
        name: "Moyenne Générale",
        expression: "AVERAGE(FactNotes[note])",
        format: "decimal",
        description: "Moyenne de toutes les notes",
      },
      {
        name: "Moyenne Pondérée",
        expression:
          "SUMX(FactNotes, FactNotes[note] * RELATED(DimMatieres[coefficient])) / SUM(DimMatieres[coefficient])",
        format: "decimal",
        description: "Moyenne pondérée par les coefficients des matières",
      },
      {
        name: "Taux de Réussite",
        expression:
          "DIVIDE(COUNTX(FILTER(FactNotes, FactNotes[note] >= 10), FactNotes[etudiant_id]), DISTINCTCOUNT(FactNotes[etudiant_id]))",
        format: "percentage",
        description: "Pourcentage d'étudiants ayant une moyenne >= 10",
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
    csv: [
      {
        id: "1",
        Nom: "Dupont",
        Prénom: "Jean",
        NoteMath: "14,5",
        NotePhysique: "12,0",
        Ville: "Paris",
        DateNaissance: "15/03/2006",
      },
      {
        id: "2",
        Nom: "Martin",
        Prénom: "Sophie",
        NoteMath: "16,0",
        NotePhysique: "15,5",
        Ville: "Lyon",
        DateNaissance: "22/07/2006",
      },
      {
        id: "3",
        Nom: "Dubois",
        Prénom: "Pierre",
        NoteMath: "10,5",
        NotePhysique: "11,0",
        Ville: "Marseille",
        DateNaissance: "05/01/2006",
      },
      {
        id: "4",
        Nom: "Lefèvre",
        Prénom: "Emma",
        NoteMath: "18,0",
        NotePhysique: "17,5",
        Ville: "Paris",
        DateNaissance: "30/09/2006",
      },
      {
        id: "5",
        Nom: "Moreau",
        Prénom: "Lucas",
        NoteMath: "9,5",
        NotePhysique: "10,0",
        Ville: "Lyon",
        DateNaissance: "12/11/2006",
      },
    ],
    api: [
      {
        id: "1",
        name: "Dupont",
        firstName: "Jean",
        mathGrade: "14.5",
        physicsGrade: "12.0",
        city: "Paris",
        birthDate: "2006-03-15",
      },
      {
        id: "2",
        name: "Martin",
        firstName: "Sophie",
        mathGrade: "16.0",
        physicsGrade: "15.5",
        city: "Lyon",
        birthDate: "2006-07-22",
      },
      {
        id: "3",
        name: "Dubois",
        firstName: "Pierre",
        mathGrade: "10.5",
        physicsGrade: "11.0",
        city: "Marseille",
        birthDate: "2006-01-05",
      },
      {
        id: "4",
        name: "Lefèvre",
        firstName: "Emma",
        mathGrade: "18.0",
        physicsGrade: "17.5",
        city: "Paris",
        birthDate: "2006-09-30",
      },
      {
        id: "5",
        name: "Moreau",
        firstName: "Lucas",
        mathGrade: "9.5",
        physicsGrade: "10.0",
        city: "Lyon",
        birthDate: "2006-11-12",
      },
    ],
    excel: [
      {
        ID: "1",
        NOM: "DUPONT",
        PRENOM: "JEAN",
        NOTE_MATH: "14,5",
        NOTE_PHYSIQUE: "12,0",
        VILLE: "PARIS",
        DATE_NAISSANCE: "15/03/2006",
      },
      {
        ID: "2",
        NOM: "MARTIN",
        PRENOM: "SOPHIE",
        NOTE_MATH: "16,0",
        NOTE_PHYSIQUE: "15,5",
        VILLE: "LYON",
        DATE_NAISSANCE: "22/07/2006",
      },
      {
        ID: "3",
        NOM: "DUBOIS",
        PRENOM: "PIERRE",
        NOTE_MATH: "10,5",
        NOTE_PHYSIQUE: "11,0",
        VILLE: "MARSEILLE",
        DATE_NAISSANCE: "05/01/2006",
      },
      {
        ID: "4",
        NOM: "LEFEVRE",
        PRENOM: "EMMA",
        NOTE_MATH: "18,0",
        NOTE_PHYSIQUE: "17,5",
        VILLE: "PARIS",
        DATE_NAISSANCE: "30/09/2006",
      },
      {
        ID: "5",
        NOM: "MOREAU",
        PRENOM: "LUCAS",
        NOTE_MATH: "9,5",
        NOTE_PHYSIQUE: "10,0",
        VILLE: "LYON",
        DATE_NAISSANCE: "12/11/2006",
      },
    ],
  },
  bronze: [
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      note_math: "14.5",
      note_physique: "12.0",
      ville: "Paris",
      date_naissance: "15/03/2006",
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Sophie",
      note_math: "16.0",
      note_physique: "15.5",
      ville: "Lyon",
      date_naissance: "22/07/2006",
    },
    {
      id: "3",
      nom: "Dubois",
      prenom: "Pierre",
      note_math: "10.5",
      note_physique: "11.0",
      ville: "Marseille",
      date_naissance: "05/01/2006",
    },
    {
      id: "4",
      nom: "Lefèvre",
      prenom: "Emma",
      note_math: "18.0",
      note_physique: "17.5",
      ville: "Paris",
      date_naissance: "30/09/2006",
    },
    {
      id: "5",
      nom: "Moreau",
      prenom: "Lucas",
      note_math: "9.5",
      note_physique: "10.0",
      ville: "Lyon",
      date_naissance: "12/11/2006",
    },
    {
      id: "6",
      nom: "Bernard",
      prenom: "Chloé",
      note_math: "13.0",
      note_physique: "14.0",
      ville: "Marseille",
      date_naissance: "18/05/2006",
    },
    {
      id: "7",
      nom: "Thomas",
      prenom: "Hugo",
      note_math: "11.5",
      note_physique: "12.5",
      ville: "Paris",
      date_naissance: "02/08/2006",
    },
    {
      id: "8",
      nom: "Petit",
      prenom: "Léa",
      note_math: "15.0",
      note_physique: "14.0",
      ville: "Lyon",
      date_naissance: "25/04/2006",
    },
    {
      id: "9",
      nom: "Robert",
      prenom: "Nathan",
      note_math: "8.5",
      note_physique: "9.0",
      ville: "Marseille",
      date_naissance: "10/12/2006",
    },
    {
      id: "10",
      nom: "Richard",
      prenom: "Camille",
      note_math: "17.0",
      note_physique: "16.0",
      ville: "Paris",
      date_naissance: "07/06/2006",
    },
  ],
  silver: [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      note_math: 14.5,
      note_physique: 12.0,
      ville: "Paris",
      date_naissance: "2006-03-15",
      sexe: "M",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      note_math: 16.0,
      note_physique: 15.5,
      ville: "Lyon",
      date_naissance: "2006-07-22",
      sexe: "F",
    },
    {
      id: 3,
      nom: "Dubois",
      prenom: "Pierre",
      note_math: 10.5,
      note_physique: 11.0,
      ville: "Marseille",
      date_naissance: "2006-01-05",
      sexe: "M",
    },
    {
      id: 4,
      nom: "Lefèvre",
      prenom: "Emma",
      note_math: 18.0,
      note_physique: 17.5,
      ville: "Paris",
      date_naissance: "2006-09-30",
      sexe: "F",
    },
    {
      id: 5,
      nom: "Moreau",
      prenom: "Lucas",
      note_math: 9.5,
      note_physique: 10.0,
      ville: "Lyon",
      date_naissance: "2006-11-12",
      sexe: "M",
    },
    {
      id: 6,
      nom: "Bernard",
      prenom: "Chloé",
      note_math: 13.0,
      note_physique: 14.0,
      ville: "Marseille",
      date_naissance: "2006-05-18",
      sexe: "F",
    },
    {
      id: 7,
      nom: "Thomas",
      prenom: "Hugo",
      note_math: 11.5,
      note_physique: 12.5,
      ville: "Paris",
      date_naissance: "2006-08-02",
      sexe: "M",
    },
    {
      id: 8,
      nom: "Petit",
      prenom: "Léa",
      note_math: 15.0,
      note_physique: 14.0,
      ville: "Lyon",
      date_naissance: "2006-04-25",
      sexe: "F",
    },
    {
      id: 9,
      nom: "Robert",
      prenom: "Nathan",
      note_math: 8.5,
      note_physique: 9.0,
      ville: "Marseille",
      date_naissance: "2006-12-10",
      sexe: "M",
    },
    {
      id: 10,
      nom: "Richard",
      prenom: "Camille",
      note_math: 17.0,
      note_physique: 16.0,
      ville: "Paris",
      date_naissance: "2006-06-07",
      sexe: "F",
    },
  ],
  gold: {
    moyenne_par_ville: [
      { ville: "Paris", moyenne_math: 15.25, moyenne_physique: 14.5, moyenne_generale: 14.88, nombre_etudiants: 4 },
      { ville: "Lyon", moyenne_math: 13.5, moyenne_physique: 13.17, moyenne_generale: 13.33, nombre_etudiants: 3 },
      { ville: "Marseille", moyenne_math: 10.67, moyenne_physique: 11.33, moyenne_generale: 11.0, nombre_etudiants: 3 },
    ],
    moyenne_par_sexe: [
      { sexe: "M", moyenne_math: 10.9, moyenne_physique: 11.0, moyenne_generale: 10.95, nombre_etudiants: 5 },
      { sexe: "F", moyenne_math: 15.8, moyenne_physique: 15.4, moyenne_generale: 15.6, nombre_etudiants: 5 },
    ],
    distribution_notes: [
      { tranche_note: "0-5", nombre_math: 0, nombre_physique: 0, pourcentage_math: 0, pourcentage_physique: 0 },
      { tranche_note: "5-10", nombre_math: 2, nombre_physique: 1, pourcentage_math: 20, pourcentage_physique: 10 },
      { tranche_note: "10-15", nombre_math: 4, nombre_physique: 5, pourcentage_math: 40, pourcentage_physique: 50 },
      { tranche_note: "15-20", nombre_math: 4, nombre_physique: 4, pourcentage_math: 40, pourcentage_physique: 40 },
    ],
  },
  semantic: {
    tables: [
      { name: "DimEtudiants", rows: 10, columns: 6 },
      { name: "DimVilles", rows: 3, columns: 4 },
      { name: "FactNotes", rows: 20, columns: 4 },
      { name: "DimMatieres", rows: 2, columns: 3 },
    ],
    relationships: [
      {
        fromTable: "FactNotes",
        fromColumn: "etudiant_id",
        toTable: "DimEtudiants",
        toColumn: "id",
        type: "many-to-one",
      },
      { fromTable: "FactNotes", fromColumn: "matiere_id", toTable: "DimMatieres", toColumn: "id", type: "many-to-one" },
      { fromTable: "DimEtudiants", fromColumn: "ville_id", toTable: "DimVilles", toColumn: "id", type: "many-to-one" },
    ],
    measures: [
      { name: "Moyenne Générale", value: 13.25 },
      { name: "Moyenne Pondérée", value: 13.75 },
      { name: "Taux de Réussite", value: 0.8 },
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
      data: mockData.gold.moyenne_par_ville,
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

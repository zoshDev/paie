# Contrats API

Ce document définit les contrats d'interface entre le frontend et le backend.

## 1. Points d'Entrée API

Base URL : `http://localhost:8000/api/v1`

## 2. Authentication

### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "username": string,
  "password": string
}

Response: 200 OK
{
  "access_token": string,
  "token_type": "bearer",
  "expires_in": number
}

Error: 401 Unauthorized
{
  "detail": "Invalid credentials"
}
```

### Refresh Token
```
POST /auth/refresh-token
Authorization: Bearer <token>

Response: 200 OK
{
  "access_token": string,
  "token_type": "bearer",
  "expires_in": number
}

Error: 401 Unauthorized
{
  "detail": "Invalid token"
}
```

## 3. Employés

### Liste des Employés
```
GET /employees
Authorization: Bearer <token>
Query Parameters:
  - page: number
  - pageSize: number
  - search: string
  - categorie_id: number
  - status: "active" | "inactive" | "en_conge"

Response: 200 OK
{
  "items": [
    {
      "id": number,
      "matricule": string,
      "nom": string,
      "prenom": string,
      "date_embauche": string,
      "poste": string,
      "categorie_id": number,
      "categorie": {
        "id": number,
        "code": string,
        "nom": string
      },
      "status": string
    }
  ],
  "total": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

### Créer un Employé
```
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "matricule": string,
  "nom": string,
  "prenom": string,
  "date_embauche": string,
  "poste": string,
  "categorie_id": number,
  "echelon": number
}

Response: 201 Created
{
  "id": number,
  ...request body
}

Error: 400 Bad Request
{
  "detail": {
    "field": ["error message"]
  }
}
```

## 4. Rubriques

### Liste des Rubriques
```
GET /rubriques
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": number,
    "code": string,
    "nom": string,
    "type": "salaire" | "gain" | "deduction",
    "methode_calcul": "montant_fixe" | "pourcentage" | "formule",
    "ordre_application": number,
    "qui_paie": "employe" | "employeur" | "les_deux",
    "taux_employe": number | null,
    "taux_employeur": number | null,
    "valeur_defaut": number | null,
    "formule": string | null
  }
]
```

### Créer une Rubrique
```
POST /rubriques
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "code": string,
  "nom": string,
  "type": "salaire" | "gain" | "deduction",
  "methode_calcul": "montant_fixe" | "pourcentage" | "formule",
  "ordre_application": number,
  "qui_paie": "employe" | "employeur" | "les_deux",
  "taux_employe"?: number,
  "taux_employeur"?: number,
  "valeur_defaut"?: number,
  "formule"?: string
}

Response: 201 Created
{
  "id": number,
  ...request body
}
```

## 5. Fiches de Paie

### Générer une Fiche de Paie
```
POST /fiches-paie/generate
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "employee_id": number,
  "periode": string,
  "rubriques"?: number[]
}

Response: 201 Created
{
  "id": number,
  "employee_id": number,
  "periode": string,
  "date_generation": string,
  "salaire_brut": number,
  "total_retenues": number,
  "salaire_net": number,
  "lignes_paie": [
    {
      "id": number,
      "rubrique_id": number,
      "base": number,
      "taux": number,
      "montant": number
    }
  ]
}
```

### Récupérer une Fiche de Paie
```
GET /fiches-paie/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "id": number,
  "employee_id": number,
  "employee": {
    "id": number,
    "matricule": string,
    "nom": string,
    "prenom": string
  },
  "periode": string,
  "date_generation": string,
  "salaire_brut": number,
  "total_retenues": number,
  "salaire_net": number,
  "lignes_paie": [
    {
      "id": number,
      "rubrique_id": number,
      "rubrique": {
        "id": number,
        "code": string,
        "nom": string
      },
      "base": number,
      "taux": number,
      "montant": number
    }
  ]
}
```

## 6. Catégories

### Liste des Catégories
```
GET /categories
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": number,
    "code": string,
    "nom": string,
    "description": string | null,
    "echelons": [
      {
        "id": number,
        "niveau": number,
        "salaire_base": number
      }
    ]
  }
]
```

### Créer une Catégorie
```
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "code": string,
  "nom": string,
  "description"?: string,
  "echelons": [
    {
      "niveau": number,
      "salaire_base": number
    }
  ]
}

Response: 201 Created
{
  "id": number,
  ...request body
}
```

## 7. Format des Erreurs

### Erreur 400 (Bad Request)
```
{
  "detail": {
    "field": ["error message"]
  }
}
```

### Erreur 401 (Unauthorized)
```
{
  "detail": "Invalid token"
}
```

### Erreur 403 (Forbidden)
```
{
  "detail": "Not enough privileges"
}
```

### Erreur 404 (Not Found)
```
{
  "detail": "Resource not found"
}
```

### Erreur 422 (Validation Error)
```
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "error message",
      "type": "validation_error"
    }
  ]
}
```

### Erreur 500 (Server Error)
```
{
  "detail": "Internal server error"
}
```

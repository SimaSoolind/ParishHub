// errors — samlade felklasser för typsäker felhantering
// Basklass AppError + specialiserade underklasser
// Används i lib/api.ts (safeFetch) och där fel behöver behandlas per typ (instanceof)
//
// Fälten deklareras explicit (inte via parameter-properties) eftersom
// tsconfig har erasableSyntaxOnly på — parameter-properties genererar kod

// Basklass för alla appspecifika fel — gör instanceof-kontroll möjlig
export class AppError extends Error {
  constructor(message: string) {
    super(message)
    // Sätter name till klassens namn — annars visar konsolen bara "Error"
    this.name = this.constructor.name
  }
}

// Kastas när validering misslyckas eller data har fel form
export class ValidationError extends AppError {
  field?: string | undefined

  constructor(message: string, field?: string) {
    super(message)
    this.field = field
  }
}

// Kastas vid nätverksfel — timeout, offline eller felkoder (t.ex. 404, 500)
export class NetworkError extends AppError {
  status?: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

// Kastas vid autentiseringsfel — 401, saknad token eller utgången session
export class AuthError extends AppError {
  constructor(message: string) {
    super(message)
  }
}

import { apiRequest } from './client'

export interface AuthUser {
  id: string
  alias: string
  email: string | null
}

export interface CredentialsInput {
  email: string
  password: string
}

export type RegisterInput = CredentialsInput
export type LoginInput = CredentialsInput

/**
 * POST /api/auth/register: tworzy konto z aliasem i od razu loguje (US01)
 */
export function apiRegister(credentials: RegisterInput): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: credentials,
  })
}

/**
 * POST /api/auth/login: loguje użytkownika i ustawia ciasteczko sesyjne
 */
export function apiLogin(credentials: LoginInput): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

/**
 * POST /api/auth/logout: czyści ciasteczko sesyjne
 */
export function apiLogout(): Promise<void> {
  return apiRequest<void>('/api/auth/logout', {
    method: 'POST',
  })
}

/**
 * GET /api/auth/me: zwraca profil zalogowanego użytkownika (jedyne miejsce z e-mailem, ADR-007)
 */
export function apiGetMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/me', {
    method: 'GET',
  })
}

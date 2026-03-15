import axios from "axios"

const API_URL = "http://localhost:4001/api"

// ── Auth ──────────────────────────────────────────────

export interface LoginModel {
  email: string
  password: string
}

export interface RegisterModel {
  email: string
  password: string
  firstname: string
  lastname: string
  birthdate: string
  role: "ADMIN" | "CLIENT"
}

export interface AuthResponse {
  message: string
  token: string
}

export const loginApi = async (data: LoginModel): Promise<AuthResponse> => {
  try {
    const { data: res } = await axios.post(`${API_URL}/auth/login`, data)
    return res
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Une erreur est survenue")
  }
}

export const registerApi = async (data: RegisterModel): Promise<AuthResponse> => {
  try {
    const { data: res } = await axios.post(`${API_URL}/auth/register`, data)
    return res
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Une erreur est survenue")
  }
}

// ── User ──────────────────────────────────────────────

export interface UserModel {
  _id: string
  email: string
  firstname: string
  lastname: string
  role: string
  birthdate: string
  createdAt: string
}

export const decodeToken = (token: string): { id: string; role: string } => {
  const payload = token.split(".")[1] ?? ""
  return JSON.parse(atob(payload))
}

export const getUserApi = async (id: string, token: string): Promise<UserModel> => {
  try {
    const { data } = await axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.user
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Une erreur est survenue")
  }
}
export interface RegisterBody {
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: number;
  email: string;
  role: "customer";
  created_at: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: "customer" | "admin";
}

export interface LoginResult {
  token: string;
}

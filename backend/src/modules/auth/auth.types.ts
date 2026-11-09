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

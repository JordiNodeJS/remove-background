// lib/types.ts
export interface ApiResponse {
  status: number;
  message: string;
  data?: {
    url: string;
  };
}

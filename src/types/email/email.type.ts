import { ErrorResponse } from "../api-response/error.type";

export interface ResetPasswordEmailResult {
  status: string;
  message: string;
}

export type ResetPasswordEmailResponse = ResetPasswordEmailResult | ErrorResponse;
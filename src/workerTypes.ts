export interface WorkerRequest {
  id: string;
  regexStr: string;
  type: string;
}

export interface WorkerResponse {
  id: string;
  code?: string;
  error?: string;
}

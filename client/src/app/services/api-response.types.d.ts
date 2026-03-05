interface BaseApiResponse {
  ok: boolean;
  errors: string[];
  data: unknown;
}

interface LoginResponse extends BaseApiResponse {
  data: {
    accessToken: string;
  };
}

interface RegisterResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}

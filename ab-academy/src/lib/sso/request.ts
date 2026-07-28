import type { EnabledSsoConfig } from "./config";
import { isValidPkceChallenge } from "./crypto";

export type AuthorizationRequest = {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
};

const STATE_MAX_LENGTH = 512;

function exactParam(params: URLSearchParams, name: string) {
  const values = params.getAll(name);
  return values.length === 1 ? values[0] : null;
}

export function parseAuthorizationRequest(
  url: URL,
  config: EnabledSsoConfig
): AuthorizationRequest | null {
  const clientId = exactParam(url.searchParams, "client_id");
  const redirectUri = exactParam(url.searchParams, "redirect_uri");
  const responseType = exactParam(url.searchParams, "response_type");
  const state = exactParam(url.searchParams, "state");
  const codeChallenge = exactParam(url.searchParams, "code_challenge");
  const method = exactParam(url.searchParams, "code_challenge_method");

  if (
    clientId !== config.clientId ||
    !redirectUri ||
    !config.redirectUris.has(redirectUri) ||
    responseType !== "code" ||
    method !== "S256" ||
    !state ||
    state.length > STATE_MAX_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(state) ||
    !isValidPkceChallenge(codeChallenge)
  ) {
    return null;
  }

  return { clientId, redirectUri, state, codeChallenge };
}

export function authorizationRequestUrl(request: AuthorizationRequest) {
  const params = new URLSearchParams({
    client_id: request.clientId,
    redirect_uri: request.redirectUri,
    response_type: "code",
    state: request.state,
    code_challenge: request.codeChallenge,
    code_challenge_method: "S256",
  });
  return `/api/sso/authorize?${params}`;
}

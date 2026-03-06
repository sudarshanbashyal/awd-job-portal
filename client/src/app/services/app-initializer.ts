import { AuthService } from './auth.service';

export function initAuth(auth: AuthService) {
  return () => auth.loadUserToken();
}

export function initUser(auth: AuthService) {
  return () => auth.loadUser();
}

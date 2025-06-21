import { vi } from 'vitest';

export const useAuthService = () => ({
  login: vi.fn(),
  register: vi.fn(),
  isLoggingIn: false,
  isRegistering: false,
  user: null,
}); 
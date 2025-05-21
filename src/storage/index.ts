export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('token');
};

export const getUserData = (): string | null => {
  return localStorage.getItem('user');
};

export const setUserData = (token: string): void => {
  localStorage.setItem('user', token);
};

export const clearUserData = (): void => {
  localStorage.removeItem('user');
};
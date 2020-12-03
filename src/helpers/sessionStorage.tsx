export const setSandboxLogin = token => {
  if (window.sessionStorage) {
    window.sessionStorage.setItem('sandbox_login', token);
  }
};

export const getSandboxLogin = () => {
  if (window.sessionStorage) {
    return window.sessionStorage.getItem('sandbox_login');
  }
  return '';
};

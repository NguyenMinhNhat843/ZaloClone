export const logoutAndRedirect = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/login';
};

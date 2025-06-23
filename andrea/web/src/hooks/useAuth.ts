export const useAuth = () => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    return { user };
  };
  
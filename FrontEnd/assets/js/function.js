// fonction pour récuperer l'id utilisateur et le token
function getAuthorization() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth?.token ? `Bearer ${auth.token}` : '';
}

// Fonction pour voir si l'utilisateur est connecté
function isConnected() {
  return !!getAuthorization();
}
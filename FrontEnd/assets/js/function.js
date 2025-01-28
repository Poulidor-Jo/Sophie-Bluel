// Fonction pour récupérer le token d'autorisation de l'utilisateur
function getAuthorization() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth?.token ? `Bearer ${auth.token}` : '';
}

// Fonction pour vérifier si l'utilisateur est connecté
function isConnected() {
  return !!getAuthorization();
}
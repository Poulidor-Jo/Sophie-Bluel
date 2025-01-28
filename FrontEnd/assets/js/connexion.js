// Variables pour le mode éditeur et les boutons de modification
const modeEdition = document.querySelector(".mode-edition");
const editBtn = document.querySelectorAll(".modifier");
const logout = document.querySelector('[href="login.html"]');
const filters = document.querySelectorAll("#category");

// Si l'utilisateur est connecté, afficher le mode éditeur
if (isConnected()) {
    modeEdition.style.display = "flex";

    // Ajuster le style du logo et du menu de navigation
    const logo = document.querySelector("#logo");
    logo.style.paddingTop = "25px";
    logo.style.fontSize = "17px";

    const navHeader = document.querySelector("#navHeader");
    navHeader.style.paddingTop = "25px";

    // Masquer les filtres de catégorie
    for (let i = 0; i < filters.length; i++) {
        filters[i].style.display = "none";
    }
    
    // Afficher les boutons de modification
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].style.display = "flex";
    }

    // Changer le texte du lien de connexion en "logout"
    logout.textContent = "logout";
    logout.setAttribute("href", "#");

    // Déconnecter l'utilisateur lors du clic sur "logout"
    logout.addEventListener("click", event => {
        event.preventDefault();

        localStorage.removeItem("userId");
        localStorage.removeItem("auth");
        window.location.reload();
    });
}
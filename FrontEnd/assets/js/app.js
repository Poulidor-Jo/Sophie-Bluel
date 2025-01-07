let allWorks = [];
let allCategories = [];

// Fonction pour récupérer les données de l'API
const getData = async (collection) => {
    const url = `http://localhost:5678/api/${collection}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de réponse : ${response.status}`);
        }
        const data = await response.json();
        console.log("retour data", data); // Valeur data
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
    }
};

// Fonction pour ajouter un travail à la galerie
function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
                        <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);
}

// Fonction pour créer le menu de filtres
function createFilterMenu(categories) {
    const filterMenu = document.querySelector("#portfolio .filters"); // On cible la div.filters dans la section #portfolio

    // Bouton pour afficher tous les travaux
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = "";
        allWorks.forEach(setFigure);
    });
    filterMenu.append(allButton);

    // Boutons pour chaque catégorie
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener("click", () => {
            document.querySelector(".gallery").innerHTML = "";
            allWorks
                .filter(work => work.categoryId === category.id)
                .forEach(setFigure);
        });
        filterMenu.append(button);
    });
}

// Fonction d'initialisation qui récupère les travaux et les catégories en parallèle
const init = async () => {
    document.querySelector(".gallery").innerHTML = ""; // Nettoie la galerie au démarrage

    try {
        // Récupération des travaux et des catégories en parallèle avec Promise.all
        const [works, categories] = await Promise.all([
            getData("works"),
            getData("categories")
        ]);

        // Affectation des données aux variables globales
        allWorks = works;
        allCategories = categories;

        // Génération des éléments dynamiques
        allWorks.forEach((work) => setFigure(work));
        createFilterMenu(allCategories); // Création du menu de filtres
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
    }
};

// Lancer l'initialisation de l'application
init();

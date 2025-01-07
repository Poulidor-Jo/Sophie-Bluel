let allWorks = [];
let allCategories = [];

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

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
                        <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);
}

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

const init = async () => {
    document.querySelector(".gallery").innerHTML = ""; // Nettoie la galerie au démarrage

    // Récupération des travaux
    const works = await getData("works");
    console.log(works);
    allWorks = works;

    // Récupération des catégories
    const categories = await getData("categories");
    console.log(categories);
    allCategories = categories;

    // Génération des éléments dynamiques
    allWorks.forEach((work) => setFigure(work));
    createFilterMenu(allCategories); // Création du menu de filtres
};

init();

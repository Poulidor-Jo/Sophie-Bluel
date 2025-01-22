// Initialisation des variables globales
let allWorks = [];
let allCategories = [];

// Fonction d'initialisation principale
const init = async () => {
    try {
        // Effectue les deux appels à l'API en parallèle
        const [works, categories] = await Promise.all([
            fetchWorks(), // Appel pour récupérer les travaux
            fetchCategories() // Appel pour récupérer les catégories
        ]);

        // Met à jour les variables globales
        allWorks = works;
        allCategories = categories;

        // Générer les catégories et la galerie
        renderCategories(allCategories);
        renderGallery(allWorks);

        // Configurer les événements
        initializeForm();

        // Signaler que les données sont prêtes
        document.dispatchEvent(new Event('dataReady'));
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error.message);
    }
};


// Fonction pour récupérer les catégories depuis l'API
const fetchCategories = async () => {
    const url = 'http://localhost:5678/api/categories';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de réponse : ${response.status}`);
        }
        const categories = await response.json();
        localStorage.setItem('categories', JSON.stringify(categories));
        return categories;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error.message);
        return [];
    }
};

// Fonction pour récupérer les travaux depuis l'API
const fetchWorks = async () => {
    const url = 'http://localhost:5678/api/works';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de réponse : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux:", error.message);
        return [];
    }
};

// Fonction pour afficher les travaux dans la galerie
const renderGallery = (works) => {
    const gallery = document.querySelector(".gallery");
    if (!gallery) {
        console.error("Galerie introuvable dans le DOM.");
        return;
    }
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
            <figcaption>${work.title}</figcaption>`;
        gallery.appendChild(figure);
    });
};

// Fonction pour afficher le menu des catégories
const renderCategories = (categories) => {
    const filterMenu = document.querySelector("#category");
    if (!filterMenu) {
        console.error("Menu des catégories introuvable dans le DOM.");
        return;
    }
    filterMenu.innerHTML = "";

    // Ajouter le bouton "Tous"
    const allButton = document.createElement("a");
    allButton.textContent = "Tous";
    allButton.onclick = () => renderGallery(allWorks);
    allButton.classList.add("subcat");
    filterMenu.appendChild(allButton);

    categories.forEach(category => {
        const link = document.createElement("a");
        link.textContent = category.name;
        link.onclick = () => {
            const filteredWorks = category.id === 0 
                ? allWorks 
                : allWorks.filter(work => work.categoryId === category.id);
            renderGallery(filteredWorks);
        };
        link.classList.add("subcat");
        filterMenu.appendChild(link);
    });
};

// Fonction pour configurer le formulaire d'ajout de projet
const initializeForm = () => {
    const form = document.querySelector("#addProjectForm");
    const errorDiv = document.querySelector("#formError");

    if (!form) {
        console.error("Formulaire introuvable dans le DOM.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorDiv.textContent = "";

        const formData = new FormData(form);
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: getAuthorizationToken(),
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du projet");
            }

            const newWork = await response.json();
            allWorks.push(newWork);
            renderGallery(allWorks);
            form.reset();
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });
};

// Fonction utilitaire pour obtenir le token d'autorisation
const getAuthorizationToken = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.token ? `Bearer ${auth.token}` : '';
};

// Initialiser le script après le chargement du DOM
document.addEventListener("DOMContentLoaded", init);


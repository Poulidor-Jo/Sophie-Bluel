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
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error.message);
  }
};

// Fonction pour ajouter un travail à la galerie
const setFigure = (work) => {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
    <figcaption>${work.title}</figcaption>`;
  gallery.appendChild(figure);
};

// Fonction pour créer le menu de filtres
const createFilterMenu = (categories) => {
  const filterMenu = document.querySelector("#category"); // Cible le bon élément HTML

  if (!filterMenu) {
    console.error("L'élément #category est introuvable dans le DOM.");
    return;
  }

  filterMenu.innerHTML = ""; // Nettoie les filtres existants

  console.log("Création des filtres avec catégories :", categories); // Ajout d'un log pour vérifier

  categories.forEach((category) => {
    const link = document.createElement("a");
    link.textContent = category.name;

    link.onclick = () => {
      document.querySelector(".gallery").innerHTML = ""; // Réinitialise la galerie
      if (category.id === 0) {
        allWorks.forEach(setFigure);
      } else {
        const filteredWorks = allWorks.filter((work) => work.categoryId === category.id);
        filteredWorks.forEach(setFigure);
      }
    };

    link.classList.add("subcat");
    link.setAttribute("tabindex", "0");
    filterMenu.appendChild(link);
  });
};

// Fonction pour afficher la galerie dans la boîte modale
const addWorkModal = () => {
  const galleryModal = document.querySelector(".gallerymodal");

  if (!galleryModal) {
    console.error("L'élément .gallerymodal est introuvable dans le DOM.");
    return;
  }

  galleryModal.innerHTML = "";

  allWorks.forEach((work) => {
    const div = document.createElement("div");
    div.id = "gallery_edit_img";

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.crossOrigin = "anonymous";
    div.appendChild(img);

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa fa-trash";
    trashIcon.dataset.id = work.id;
    trashIcon.onclick = () => deleteWork(work.id);
    div.appendChild(trashIcon);

    const editText = document.createElement("p");
    editText.textContent = "éditer";
    div.appendChild(editText);

    galleryModal.appendChild(div);
  });
};

// Fonction pour initialiser l'application
const init = async () => {
  const gallery = document.querySelector(".gallery");

  if (!gallery) {
    console.error("L'élément .gallery est introuvable.");
    return;
  }

  gallery.innerHTML = ""; // Nettoie la galerie au démarrage

  try {
    // Récupération des catégories et des travaux en parallèle
    const [works, categories] = await Promise.all([getData("works"), getData("categories")]);

    // Vérifiez si les catégories sont récupérées correctement
    if (!categories || categories.length === 0) {
      throw new Error("Aucune catégorie récupérée !");
    }

    // Stockage des données globales
    allWorks = works;
    allCategories = [{ id: 0, name: "Tous" }, ...categories];

    console.log("Catégories récupérées :", allCategories); // Vérifie les données des catégories

    // Affichage initial
    allWorks.forEach(setFigure);

    // Création du menu de filtres
    createFilterMenu(allCategories);

    console.log("Application initialisée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error.message);
  }
};

// Supprimer un projet
const deleteWork = async (id) => {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur lors de la suppression : ${response.status}`);
    console.log(`Travail ${id} supprimé`);
    allWorks = allWorks.filter((work) => work.id !== id);
    addWorkModal();
    document.querySelector(".gallery").innerHTML = "";
    allWorks.forEach(setFigure);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error.message);
  }
};

// Lancer l'application
init();



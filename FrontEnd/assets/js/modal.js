// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modalsSuppr");
const openGalleryModalBtn = document.querySelector("#projectEdit");
const closeGalleryModalBtn = document.querySelector("#fermer-suppr");

// Variables pour la modal ajout de projets
const modalAddWork = document.querySelector("#modalsAjout");
const openAddWork = document.querySelector("#AjoutPhoto");
const previousBtn = document.querySelector(".precedent");
const closeAddWorkModalBtn = document.querySelector("#fermer-ajout");
const deleteGalleryBtn = document.querySelector("#supprgalerie");

// Variables pour upload une image
const uploadImageInput = document.querySelector("#imageUpload");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#validerAjout");
const backgroundPreview = document.querySelector(".AjoutPhotoContainer");

const addProjectForm = document.querySelector("#ajout-form");

// Variable pour background modal
const backgroundModal = document.querySelector("#modals");

// Fonction pour ouvrir modal galerie pour supprimer un projet et celle pour ajouter un projet
function openGalleryModal() {
    modalDeleteWork.style.display = "flex";
    backgroundModal.style.display = "block";
    updateGalleryInModal();
}

function openAddWorkModal() {
    modalAddWork.style.display = "flex";
    backgroundModal.style.display = "block";
}

// Fonction pour fermeture des modals
function closeGalleryModal() {
    modalDeleteWork.style.display = "none";
    backgroundModal.style.display = "none";
}

function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backgroundModal.style.display = "none";
}

// Ouvrir les modals
if (openGalleryModalBtn) openGalleryModalBtn.addEventListener("click", openGalleryModal);
if (openAddWork) openAddWork.addEventListener("click", function() {
    closeGalleryModal();
    openAddWorkModal();
});

// Fermer les modals et précédent
if (closeGalleryModalBtn) closeGalleryModalBtn.addEventListener("click", closeGalleryModal);
if (closeAddWorkModalBtn) closeAddWorkModalBtn.addEventListener("click", closeAddWorkModal);

if (previousBtn) previousBtn.addEventListener("click", function() {
    closeAddWorkModal();
    openGalleryModal();
});

window.onclick = function (event) {
    if (event.target == backgroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
    }
};

// Mettre à jour la galerie dans la modal
function updateGalleryInModal() {
    const modalGallery = document.querySelector(".gallerymodal");
    const mainGallery = document.querySelector(".gallery");

    if (!modalGallery) {
        console.error("Modal gallery introuvable dans le DOM.");
        return;
    }
    modalGallery.innerHTML = "";
    if (typeof allWorks !== "undefined" && allWorks.length > 0) {
        allWorks.forEach(work => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", work.id);
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
                <figcaption>${work.title}</figcaption>
                <button onclick="deleteWork(event, ${work.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>`;
            modalGallery.appendChild(figure);
        });
    } else {
        console.log("Aucun travail disponible pour la galerie de la modale.");
    }

    // Synchroniser avec la galerie principale
    if (mainGallery) {
        mainGallery.innerHTML = modalGallery.innerHTML;
    }
}

// Supprimer des photos
function deleteWork(event, id) {
    fetch(`http://localhost:5678/api/works/${id}` , {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Authorization': getAuthorization(),
            'Content-Type': 'application/json',
        }
    })
    .then(() => {
        // Retirer l'élément du DOM dans la modale
        const removeElements = document.querySelectorAll(`[data-id="${id}"]`);
        removeElements.forEach(el => el.remove());

        // Retirer l'élément de la liste allWorks
        allWorks = allWorks.filter(work => work.id !== id);

        // Synchroniser avec la galerie principale
        const mainGallery = document.querySelector(".gallery");
        if (mainGallery) {
            const mainFigure = mainGallery.querySelector(`[data-id="${id}"]`);
            if (mainFigure) mainFigure.remove();
        }

        console.log(`Élément avec ID ${id} supprimé.`);
    })
    .catch((error) => {
        console.error('Erreur lors de la suppression :', error);
    });
}

// Supprimer toute la galerie
if (deleteGalleryBtn) {
    deleteGalleryBtn.addEventListener("click", async () => {
        try {
            // Génère un tableau de requêtes pour supprimer chaque travail
            const deleteRequests = allWorks.map(work => fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: { 'Authorization': getAuthorization() },
            }));

            // Attends que toutes les suppressions soient terminées
            await Promise.all(deleteRequests);

            // Vide la liste des travaux et met à jour la galerie
            allWorks = [];
            updateGalleryInModal();
            console.log("Toute la galerie a été supprimée.");
        } catch (error) {
            console.error("Erreur lors de la suppression de la galerie :", error);
        }
    });
}


// Fonction utilitaire pour obtenir l'autorisation
function getAuthorization() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.token ? `Bearer ${auth.token}` : '';
}




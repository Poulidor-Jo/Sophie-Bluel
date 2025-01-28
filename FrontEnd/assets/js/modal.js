// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modalSupp");
const openGalleryModalBtn = document.querySelector("#projectEdit");
const closeGalleryModalBtn = document.querySelector("#deleteBtn");

// Variables pour la modal ajout de projets
const modalAddWork = document.querySelector("#modalAdd");
const openAddWork = document.querySelector("#addPicture");
const previousBtn = document.querySelector(".previousClic");
const closeAddWorkModalBtn = document.querySelector("#closeAddModal");

// Variables pour upload une image
const uploadImageInput = document.querySelector("#imageUpload");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#submitAdd");
const backgroundPreview = document.querySelector(".addPictureContainer");

const addProjectForm = document.querySelector("#addForm");

// Variable pour background modal
const backGroundModal = document.querySelector("#bckGroundModal");

// Fonction pour ouvrir la modal galerie pour supprimer un projet
function openGalleryModal() {
    modalDeleteWork.style.display = "flex";
    backGroundModal.style.display = "block";
    updateGalleryInModal();
}

// Fonction pour ouvrir la modal d'ajout de projet
function openAddWorkModal() {
    modalAddWork.style.display = "flex";
    backGroundModal.style.display = "block";
}

// Fonction pour réinitialiser la modal d'ajout de photo
function resetAddWorkModal() {
    addProjectForm.reset();
    uploadContent.style.display = "block";
    projectUpload.style.display = "none";
    submitProjet.style.backgroundColor = "#A7A7A7";
    const alert = document.getElementById('alertAdd');
    alert.style.display = "none";
}

// Fonction pour fermer la modal galerie
function closeGalleryModal() {
    modalDeleteWork.style.display = "none";
    backGroundModal.style.display = "none";
}

// Fonction pour fermer la modal d'ajout de projet
function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backGroundModal.style.display = "none";
    resetAddWorkModal();
}

// Ouvrir la modal galerie
if (openGalleryModalBtn) openGalleryModalBtn.addEventListener("click", openGalleryModal);

// Ouvrir la modal d'ajout de projet
if (openAddWork) openAddWork.addEventListener("click", function() {
    closeGalleryModal();
    openAddWorkModal();
});

// Fermer la modal galerie et revenir à la précédente
if (closeGalleryModalBtn) closeGalleryModalBtn.addEventListener("click", closeGalleryModal);
if (closeAddWorkModalBtn) closeAddWorkModalBtn.addEventListener("click", closeAddWorkModal);

if (previousBtn) previousBtn.addEventListener("click", function() {
    closeAddWorkModal();
    openGalleryModal();
});

// Fermer la modal si l'utilisateur clique en dehors
window.onclick = function (event) {
    if (event.target == backGroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
    }
};

// Mettre à jour la galerie dans la modal
function updateGalleryInModal() {
    const modalGallery = document.querySelector(".gallerymodal");

    if (!modalGallery) {
        console.error("Modal gallery introuvable dans le DOM.");
        return;
    }
    modalGallery.innerHTML = "";
    if (allWorks.length > 0) {
        allWorks.forEach(work => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", work.id);
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
            `;
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-trash");
            icon.addEventListener("click", function(event) {
                deleteWork(event, work.id);
            });
            figure.appendChild(icon);
            modalGallery.appendChild(figure);
        });
    } else {
        console.log("Aucun travail disponible pour la galerie de la modale.");
    }
}

// Supprimer des photos
const deleteWork = async (event, id) => {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        // Retirer l'élément du DOM dans la modale
        document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());

        // Retirer l'élément de la liste allWorks
        allWorks = allWorks.filter(work => work.id !== id);

        // Synchroniser avec la galerie principale
        renderGallery(allWorks);

        // Afficher le message de confirmation de suppression
        const alertDelete = document.getElementById('alertDelete');
        alertDelete.textContent = "Votre photo a été supprimée avec succès";
        alertDelete.style.display = "block";

        setTimeout(() => {
            alertDelete.style.display = "none";
        }, 5000);

        console.log(`Élément avec ID ${id} supprimé.`);
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
    }
};

// Fonction pour ajouter des projets
const sendWorkData = async (data) => {
    const postWorkUrl = 'http://localhost:5678/api/works';

    const response = await fetch(postWorkUrl, {
        method: "POST",
        headers: {
            'Authorization': getAuthorization()
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du projet');
    }

    return response.json();
};

// Fonction pour gérer l'envoi du formulaire
const trySendForm = async (event) => {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis
    if (!addProjectForm.checkValidity()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire
    const title = addProjectForm.querySelector("#titreAjout").value;
    const category = addProjectForm.querySelector("#selectCategorie").value;
    const file = uploadImageInput.files[0];

    // Vérifier si un fichier est sélectionné
    if (!file) {
        alert("Veuillez sélectionner une image.");
        return;
    }

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoyer les données et afficher la réponse
    try {
        const response = await sendWorkData(formData);
        console.log(response);

        const alert = document.getElementById('alertAdd');
        alert.textContent = "Votre photo a été ajoutée avec succès";
        alert.style.display = "block";

        // Mettre à jour la galerie principale
        allWorks.push(response);
        renderGallery(allWorks);

        setTimeout(() => {
            alert.style.display = "none";
        }, 5000);
    } catch (error) {
        console.error("Erreur :", error);
    }
};

// Fonction pour afficher l'aperçu de l'image
const uploadImage = () => {
    const file = uploadImageInput.files?.[0];

    if (file) {
        const reader = new FileReader();
        const image = new Image();

        reader.onload = (event) => {
            image.src = event.target.result;
            image.alt = file.name.split(".")[0];
        };

        reader.readAsDataURL(file);

        // Mettre à jour l'interface utilisateur
        uploadContent.style.display = "none";
        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        projectUpload.style.backgroundColor = "#FFFFFF"; // Assurez-vous que cette ligne est correcte

        // Ajouter l'image à l'aperçu
        projectUpload.innerHTML = ''; // Nettoyer avant d'ajouter une nouvelle image
        projectUpload.appendChild(image);
    }
};

// Écouteurs d'événements pour gérer l'upload de photos et l'envoi du formulaire
uploadImageInput.addEventListener("change", uploadImage);
addProjectForm.addEventListener("submit", trySendForm);
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
const uploadContent = document.querySelector("#previewDetails");
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
    uploadContent.style.display = "flex"; 
    projectUpload.style.display = "none";
    submitProjet.style.backgroundColor = "#A7A7A7";
    const alert = document.getElementById('alertAdd');
    alert.style.display = "none";
    uploadContent.classList.remove("hide-icon"); // Réafficher l'icône de prévisualisation
    document.getElementById("btnImage").style.display = "block"; // Réafficher le bouton "Ajouter photo"
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

        // Retire l'élément du DOM dans la modale
        document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());

        // Retire l'élément de la liste allWorks
        allWorks = allWorks.filter(work => work.id !== id);

        // Synchroniser avec la galerie principale
        renderGallery(allWorks);

        // Afficher le message de confirmation de suppression
        const alertDelete = document.getElementById('alertDelete');
        alertDelete.classList.add('alert-delete');
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

// Fonction pour vérifier si tous les champs du formulaire sont remplis
function isFormValid() {
    const title = addProjectForm.querySelector("#titleAdd").value;
    const category = addProjectForm.querySelector("#selectCategorie").value;
    const file = uploadImageInput.files[0];
    return title && category && file;
}

// Fonction pour mettre à jour l'état du bouton de soumission
function updateSubmitButtonState() {
    if (isFormValid()) {
        submitProjet.style.backgroundColor = "#1D6154";
        submitProjet.disabled = false;
    } else {
        submitProjet.style.backgroundColor = "#A7A7A7";
        submitProjet.disabled = true;
    }
}

// Ajouter des écouteurs d'événements pour chaque champ du formulaire
addProjectForm.querySelector("#titleAdd").addEventListener("input", updateSubmitButtonState);
addProjectForm.querySelector("#selectCategorie").addEventListener("change", updateSubmitButtonState);
uploadImageInput.addEventListener("change", updateSubmitButtonState);

// Fonction pour gérer l'envoi du formulaire
const trySendForm = async (event) => {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis
    if (!isFormValid()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire
    const title = addProjectForm.querySelector("#titleAdd").value;
    const category = addProjectForm.querySelector("#selectCategorie").value;
    const file = uploadImageInput.files[0];

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoyer les données et afficher la réponse
    try {
        const response = await sendWorkData(formData);
        console.log(response);

        // Mettre à jour la galerie principale
        allWorks.push(response);
        renderGallery(allWorks);

        // Mettre à jour la galerie dans la modal
        updateGalleryInModal();

        // Réinitialiser le formulaire
        resetAddWorkModal();

        // Afficher le message de confirmation
        const alert = document.getElementById('alertAdd');
        if (alert) {
            alert.classList.add('alert-success');
            alert.textContent = "Votre photo a été ajoutée avec succès";
            alert.style.display = "block";
            console.log("Message de confirmation affiché");

            setTimeout(() => {
                alert.style.display = "none";
            }, 5000);
        } else {
            console.error("Élément #alertAdd introuvable dans le DOM.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        const alert = document.getElementById('alertAdd');
        if (alert) {
            alert.textContent = "Erreur lors de l'ajout du projet. Veuillez réessayer.";
            alert.style.display = "block";
        }
    }
};

// Fonction pour afficher l'aperçu de l'image
const uploadImage = () => {
    const file = uploadImageInput.files?.[0];

    if (file) {
        // Vérifier le format de l'image
        const validFormats = ["image/jpeg", "image/png"];
        if (!validFormats.includes(file.type)) {
            alert("Format de fichier non valide. Veuillez télécharger une image au format JPG ou PNG.");
            resetAddWorkModal();
            return;
        }

        // Vérifier le poids de l'image (4 Mo max)
        const maxSize = 4 * 1024 * 1024; // 4 Mo
        if (file.size > maxSize) {
            alert("Le fichier est trop volumineux. La taille maximale autorisée est de 4 Mo.");
            resetAddWorkModal(); 
            return;
        }

        const reader = new FileReader();
        const image = new Image();

        reader.onload = (event) => {
            image.src = event.target.result;
            image.alt = file.name.split(".")[0];
            image.style.cursor = "pointer"; // Ajouter un curseur pointeur pour indiquer que l'image est cliquable
            image.addEventListener("click", () => uploadImageInput.click()); // Ajouter un événement click pour déclencher l'input de fichier
        };

        reader.readAsDataURL(file);

        // Mettre à jour l'interface utilisateur
        uploadContent.style.display = "flex";
        projectUpload.style.display = "block";
        projectUpload.style.backgroundColor = "#FFFFFF";

        // Ajouter l'image à l'aperçu
        projectUpload.innerHTML = ''; // Nettoyer avant d'ajouter une nouvelle image
        projectUpload.appendChild(image);

        // Masquer l'icône de prévisualisation et le bouton "Ajouter photo"
        uploadContent.classList.add("hide-icon");
        document.getElementById("btnImage").style.display = "none";
    }

    // Mettre à jour l'état du bouton de soumission
    updateSubmitButtonState();
};

// Écouteurs d'événements pour gérer l'upload de photos et l'envoi du formulaire
uploadImageInput.addEventListener("change", uploadImage);
addProjectForm.addEventListener("submit", trySendForm);

// Ajouter un événement click à l'élément de prévisualisation pour déclencher l'input de fichier
projectUpload.addEventListener("click", () => uploadImageInput.click());
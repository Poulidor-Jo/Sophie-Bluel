const form = document.querySelector(".form-login").elements;
const messageError = document.getElementById("msg-error");
const loginURL = "http://localhost:5678/api/users/login";

// Fonction pour gérer la soumission du formulaire de connexion
const handleLogin = async (event) => {
    event.preventDefault();

    // Validation du formulaire
    if (form.email.value === "" || form.password.value === "") {
        messageError.style.display = "flex";
        return;
    } else {
        messageError.style.display = "none";
    }

    try {
        const response = await fetch(loginURL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value,
            }),
        });

        const data = await response.json();

        // Stocker les informations d'authentification et rediriger
        localStorage.setItem('auth', JSON.stringify(data));
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.token) {
            window.location = "index.html";
        } else {
            messageError.style.display = "flex";
        }
    } catch (error) {
        console.error('Error:', error);
        messageError.style.display = "flex";
    }
};

// Ajouter un écouteur d'événement pour le bouton de soumission
form["submit-login"].addEventListener("click", handleLogin);

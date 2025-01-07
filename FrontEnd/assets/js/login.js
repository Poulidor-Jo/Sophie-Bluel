document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Connexion réussie :", data);

            // Stocker le token dans le localStorage
            localStorage.setItem("authToken", data.token);

            // Rediriger vers une page d'accueil administre 
            window.location.href = "index.html";
        } else if (response.status === 401) {
            alert("Identifiants incorrects. Veuillez réessayer.");
        } else {
            alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error.message);
        alert("Impossible de se connecter au serveur.");
    }
});

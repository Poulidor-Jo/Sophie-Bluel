async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de réponse : ${response.status}`);
        }

        const json = await response.json();
        console.log(json); // Pour voir les données reçues
        for (let i = 0; i < json.length; i++) {
            setFigure(json[i]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
    }
}

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
                        <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
}

getWorks();
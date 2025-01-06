let allWorks = []
let allCategories= []

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
}

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
                        <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
}


const init = async() => {
    const works = await getData("works")
    console.log(works)
    allWorks = works;
    const categories = await getData("categories")
    console.log(categories)
    allCategories = categories;

}

init().then(() => {
    allWorks.forEach((work) => setFigure(work))
    console.log("allCategories", allCategories)
})
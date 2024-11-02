// selector.js
document.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById("modelSelector");
    const sections = document.querySelectorAll(".modelSection");

    // Ocultar todas las secciones al cargar la página
    sections.forEach((section) => section.style.display = "none");

    selector.addEventListener("change", () => {
        sections.forEach((section) => section.style.display = "none"); // Ocultar todas las secciones

        const selectedModel = selector.value;
        if (selectedModel) {
            document.getElementById(selectedModel).style.display = "block"; // Mostrar la sección seleccionada
        }
    });
});

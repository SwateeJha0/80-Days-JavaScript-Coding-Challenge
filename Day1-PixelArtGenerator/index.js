
let container = document.querySelector(".container");
let createGridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

let draw = false;
let erase = false;

// Update width and height values
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
});
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
});

// Create Grid
createGridButton.addEventListener("click", () => {
    container.innerHTML = ""; // Clear existing grid
    let width = gridWidth.value;
    let height = gridHeight.value;

    // Set container dimensions for grid layout
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Create grid cells
    for (let i = 0; i < width * height; i++) {
        let cell = document.createElement("div");
        cell.classList.add("gridCol");
        cell.addEventListener("mousedown", () => {
            draw = true;
            cell.style.backgroundColor = erase ? "transparent" : colorButton.value;
        });
        cell.addEventListener("mousemove", () => {
            if (draw) {
                cell.style.backgroundColor = erase ? "transparent" : colorButton.value;
            }
        });
        cell.addEventListener("mouseup", () => {
            draw = false;
        });
        container.appendChild(cell);
    }
});

// Clear Grid
clearGridButton.addEventListener("click", () => {
    container.innerHTML = ""; // Clear all cells
});

// Erase Mode
eraseBtn.addEventListener("click", () => {
    erase = true;
});

// Paint Mode
paintBtn.addEventListener("click", () => {
    erase = false;
});

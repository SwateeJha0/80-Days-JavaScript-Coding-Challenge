const preview = document.getElementById("preview"),
    styles = document.getElementById("styles"),
    ranges = document.querySelectorAll(".settings input"),
    copyButton = document.getElementById("copy-styles");

// Add event listener to each range input
ranges.forEach((range) => {
    range.addEventListener("input", generateStyles);
});

// Function to generate and update styles
function generateStyles() {
    const xShadow = document.getElementById("x-shadow").value;
    const yShadow = document.getElementById("y-shadow").value;
    const blurRadius = document.getElementById("blur-r").value;
    const spreadRadius = document.getElementById("spread-r").value;
    const shadowColor = document.getElementById("shadow-color").value;
    const shadowOpacity = document.getElementById("shadow-opacity").value;
    const shadowInset = document.getElementById("inset-shadow").checked;
    const borderRadius = document.getElementById("border-r").value;

    // Create box shadow generator CSS property value
    const boxShadow = `${shadowInset ? "inset" : ""} ${xShadow}px ${yShadow}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(shadowColor, shadowOpacity)}`;

    // Update the preview element styles
    preview.style.boxShadow = boxShadow;
    preview.style.borderRadius = `${borderRadius}px`;

    // Update textarea with generated styles
    styles.value = `box-shadow: ${boxShadow}; border-radius: ${borderRadius}px;`;
}

// Function to convert hex color and opacity to RGBA format
function hexToRgba(shadowColor, shadowOpacity) {
    const r = parseInt(shadowColor.substr(1, 2), 16);
    const g = parseInt(shadowColor.substr(3, 2), 16);
    const b = parseInt(shadowColor.substr(5, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
}

// Function to copy the generated styles
function copyStyles() {
    styles.select();
    document.execCommand("copy");
    setTimeout(() => {
        copyButton.innerHTML = "Copy styles";
    }, 500);
}

// Initialize styles on page load
generateStyles();

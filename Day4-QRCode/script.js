const downloadBtn = document.querySelector(".download");
const darkColor = document.querySelector(".dark");
const lightColor = document.querySelector(".light");
const qrContainer = document.querySelector("#qrcode");
const qrText = document.querySelector(".qr-text");
const sizeSelector = document.querySelector(".sizes");
const generateBtn = document.querySelector(".generate-btn");

let colorLight = "#ffffff";
let colorDark = "#000000";
let qrSize = 400;
let qrValue = "Hello, QR!"; // Default text

// ✅ Prevent Page Refresh
generateBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Stops the default refresh behavior
    generateQRCode();
});

// ✅ Generate QR Code on Load
function generateQRCode() {
    qrContainer.innerHTML = "";
    if (qrValue.trim() === "") {
        alert("Enter text to generate QR Code!");
        return;
    }

    new QRCode(qrContainer, {
        text: qrValue,
        width: qrSize,
        height: qrSize,
        colorDark: colorDark,
        colorLight: colorLight,
    });
}

// ✅ Handle Color Changes
darkColor.addEventListener("input", (e) => {
    colorDark = e.target.value;
    generateQRCode();
});

lightColor.addEventListener("input", (e) => {
    colorLight = e.target.value;
    generateQRCode();
});

// ✅ Handle QR Text Input
qrText.addEventListener("input", (e) => {
    qrValue = e.target.value || "Hello, QR!";
});

// ✅ Handle Size Change
sizeSelector.addEventListener("change", (e) => {
    qrSize = e.target.value;
    generateQRCode();
});

// ✅ Download QR Code
downloadBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevents any unwanted page reload
    const qrImage = qrContainer.querySelector("img");
    if (qrImage) {
        const link = document.createElement("a");
        link.href = qrImage.src;
        link.download = "qrcode.png";
        link.click();
    } else {
        alert("Generate a QR Code first!");
    }
});

// ✅ Generate a default QR Code on page load
generateQRCode();

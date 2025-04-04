const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const passwordInput = document.getElementById("password");
const copyIcon = document.getElementById("copyIcon");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.getElementById("generateBtn");
const options = document.querySelectorAll(".option input");

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!$%&|[](){}:;.,*+-#@<>~"
};

const generatePassword = () => {
    let staticPassword = "",
        randomPassword = "",
        excludeDuplicate = false,
        passLength = lengthSlider.value;

    options.forEach(option => {
        if (option.checked) {
            if (option.id === "exc-duplicate") {
                excludeDuplicate = true;
            } else if (option.id === "spaces") {
                staticPassword += " ";
            } else {
                staticPassword += characters[option.id] || "";
            }
        }
    });

    if (staticPassword.length === 0) {
        alert("Please select at least one character type!");
        return;
    }

    for (let i = 0; i < passLength; i++) {
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        if (excludeDuplicate) {
            if (!randomPassword.includes(randomChar) || randomChar === " ") {
                randomPassword += randomChar;
            } else {
                i--;
            }
        } else {
            randomPassword += randomChar;
        }
    }

    passwordInput.value = randomPassword;
};

const updatePassIndicator = () => {
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
};

const updateSlider = () => {
    lengthValue.innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
};

const copyPassword = () => {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        copyIcon.innerText = "check";
        setTimeout(() => {
            copyIcon.innerText = "copy_all";
        }, 1500);
    }
};

// Event Listeners
copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
options.forEach(option => option.addEventListener("change", generatePassword));

updateSlider();

const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Local fallback quotes
const localQuotes = [
    "The only way to do great work is to love what you do.",
    "Success is not how high you have climbed, but how you make a positive difference.",
    "Don’t let yesterday take up too much of today.",
    "Happiness depends upon ourselves.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    "Be yourself; everyone else is already taken.",
    "Do what you can, with what you have, where you are.",
    "Act as if what you do makes a difference. It does.",
    "Keep your face always toward the sunshine, and shadows will fall behind you.",
    "It does not matter how slowly you go as long as you do not stop."
];

// Function to fetch a random quote (API first, fallback to local)
const renderNewQuote = async () => {
    quoteSection.innerHTML = "<p>Loading quote...</p>"; // Show loading message

    try {
        const response = await fetch(quoteApiUrl);
        if (!response.ok) throw new Error("Failed to fetch quote");

        const data = await response.json();
        quote = data.content;
    } catch (error) {
        console.error("Error fetching quote, using local quote:", error);
        quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    }

    let quoteHTML = quote.split("").map(char => `<span class='quote-chars'>${char}</span>`).join("");
    quoteSection.innerHTML = quoteHTML;
};

// Compare user input with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    let userInputChars = userInput.value.split("");

    mistakes = 0;
    
    quoteChars.forEach((char, index) => {
        if (userInputChars[index] === undefined) {
            char.classList.remove("success", "fail");
        } else if (char.innerText === userInputChars[index]) {
            char.classList.add("success");
            char.classList.remove("fail");
        } else {
            char.classList.add("fail");
            char.classList.remove("success");
            mistakes++;
        }
    });

    document.getElementById("mistakes").innerText = mistakes;

    if (quoteChars.length === userInputChars.length && mistakes === 0) {
        displayResult();
    }
});

// Timer function
const updateTimer = () => {
    if (time > 0) {
        document.getElementById("timer").innerText = `${--time}s`;
    } else {
        displayResult();
    }
};

// Start the timer
const startTimer = () => {
    time = 60;
    document.getElementById("timer").innerText = "60s";
    timer = setInterval(updateTimer, 1000);
};

// Start test (Now ensures quote is loaded first)
const startTest = async () => {
    userInput.disabled = true; // Prevent input until quote loads
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("reset-test").style.display = "none";

    mistakes = 0;
    document.getElementById("mistakes").innerText = "0";
    document.querySelector(".result").style.display = "none";

    await renderNewQuote(); // Ensure quote loads before enabling input

    userInput.value = "";
    userInput.disabled = false;
    startTimer();
};

// Stop test and show results
const displayResult = () => {
    clearInterval(timer);
    userInput.disabled = true;

    let timeTaken = (60 - time) / 60; // Convert seconds to minutes
    if (timeTaken === 0) timeTaken = 1 / 60; // Prevent division by zero

    let wordsTyped = userInput.value.trim().split(/\s+/).length;
    let wpm = Math.round(wordsTyped / timeTaken);

    let accuracy = Math.round(((quote.length - mistakes) / quote.length) * 100);
    document.getElementById("wpm").innerText = wpm + " WPM";
    document.getElementById("accuracy").innerText = accuracy + "%";

    document.querySelector(".result").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("reset-test").style.display = "block";
};

// Reset test
const resetTest = () => {
    clearInterval(timer);
    userInput.value = "";
    userInput.disabled = true;
    document.getElementById("timer").innerText = "60s";
    document.getElementById("mistakes").innerText = "0";
    document.getElementById("wpm").innerText = "0 WPM";
    document.getElementById("accuracy").innerText = "0%";
    
    document.querySelector(".result").style.display = "none";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("reset-test").style.display = "none";
};

// Event listeners for buttons
document.getElementById("start-test").addEventListener("click", startTest);
document.getElementById("stop-test").addEventListener("click", displayResult);
document.getElementById("reset-test").addEventListener("click", resetTest);

// Initial setup (No quote on load, quote is generated only when test starts)
window.onload = () => {
    resetTest();
};

function fetchCryptoData() {
    console.log("Fetching latest crypto prices...");

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Ctether%2Cethereum%2Clitecoin%2Ccardano%2Cdogecoin&vs_currencies=usd&include_24hr_change=true')
        .then(res => res.json())
        .then(json => {
            const container = document.querySelector('.container');
            json && console.log("API Data:", json);
            const coins = Object.keys(json);

            coins.forEach(coin => {
                const price = json[coin].usd;
                const change = json[coin].usd_24h_change.toFixed(5);
                const changeIcon = change < 0 ? '🔽' : '🔼';
                const changeColor = change < 0 ? 'red' : 'green';

                let coinElement = document.getElementById(coin);
                
                if (!coinElement) {
                    coinElement = document.createElement("div");
                    coinElement.id = coin;
                    coinElement.className = `coin ${change < 0 ? 'falling' : 'rising'}`;
                    coinElement.innerHTML = `
                        <div class="coin-logo">
                            <img src="images/${coin}.png" alt="${coin} logo">
                        </div>
                        <div class="coin-name">
                            <h3>${coin.toUpperCase()}</h3>
                            <span>/USD</span>
                        </div>
                        <div class="coin-price">
                            <span class="price">$${price}</span>
                            <span class="change" style="color: ${changeColor};">${change} ${changeIcon}</span>
                        </div>
                    `;
                    container.appendChild(coinElement);
                } else {
                    coinElement.className = `coin ${change < 0 ? 'falling' : 'rising'}`;
                    coinElement.querySelector(".price").textContent = `$${price}`;
                    let changeElement = coinElement.querySelector(".change");
                    changeElement.textContent = `${change} ${changeIcon}`;
                    changeElement.style.color = changeColor;
                }
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Fetch data initially and update every 5 seconds
fetchCryptoData();
setInterval(fetchCryptoData, 5000);

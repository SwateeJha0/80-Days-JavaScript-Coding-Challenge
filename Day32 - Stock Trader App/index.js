const symbolInput = document.querySelector('#symbol');
const stockList = document.querySelector('#stock-list');
const form = document.querySelector('form');

// Replace with your actual Alpha Vantage API key
const API_KEY = 'SHAFKQUTLGG3BKI2'; 

// Function to fetch and display the top 10 stocks
async function fetchTopStocks() {
    try {
        // Using TIME_SERIES_DAILY instead of SECTOR which doesn't return symbols
        const response = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`);
        const data = await response.json();
        
        if (!data.top_gainers) {
            throw new Error('Invalid API response');
        }

        let html = '';
        // Show top 5 gainers and top 5 losers
        const stocksToShow = [...data.top_gainers.slice(0, 5), ...data.top_losers.slice(0, 5)];
        
        stocksToShow.forEach(stock => {
            const changePercent = parseFloat(stock.change_percentage);
            const changeColor = changePercent >= 0 ? 'green' : 'red';
            html += `
                <li>
                    <span class="symbol">${stock.ticker}</span>
                    <span class="change" style="color: ${changeColor}">${stock.change_percentage}</span>
                </li>    
            `;
        });

        stockList.innerHTML = html;
    } catch (error) {
        console.error('Error fetching top stocks:', error);
        stockList.innerHTML = '<li class="error">Failed to load top stocks</li>';
    }
}

// Function to fetch and display stock data for the searched symbol
async function fetchStockData(symbol) {
    if (!symbol) {
        fetchTopStocks();
        return;
    }

    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        
        const quote = data['Global Quote'];
        if (quote && quote['10. change percent']) {
            const changePercent = quote['10. change percent'];
            const changeColor = parseFloat(changePercent) >= 0 ? 'green' : 'red';
            const html = `
                <li>
                    <span class="symbol">${symbol}</span>
                    <span class="change" style="color: ${changeColor}">${changePercent}</span>
                </li>    
            `;
            stockList.innerHTML = html;
        } else {
            stockList.innerHTML = '<li class="error">Invalid Symbol or no data available</li>';
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        stockList.innerHTML = '<li class="error">Failed to fetch stock data</li>';
    }
}

// Display top 10 on page load
fetchTopStocks();

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const symbol = symbolInput.value.trim().toUpperCase();
    fetchStockData(symbol);
});
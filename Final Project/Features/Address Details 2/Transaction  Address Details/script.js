async function getAddressInfo() {
    const address = document.getElementById('addressInput').value;
    const apiKey = '1KQ2ETIZF1M4864CKFY8IU539CIH1SXZ28';

    try {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&apikey=${apiKey}`);
        const data = await response.json();
        const transactions = data.result;

        let totalSentTransactions = 0;
        let totalReceivedTransactions = 0;
        let totalTransactions = 0;
        let totalEtherReceived = 0;
        let totalEtherSent = 0; // New variable for total ether sent
        let firstTransactionTime = Infinity;
        let lastTransactionTime = 0;
        let uniqueAddresses = new Set();
        let maxReceivedValue = 0;
        let etherReceivedPerTransaction = 0;

        transactions.forEach(transaction => {
            const value = parseFloat(transaction.value) / 1e18; // Convert wei to Ether
            const time = parseInt(transaction.timeStamp);

            if (transaction.from.toLowerCase() === address.toLowerCase()) {
                totalSentTransactions++;
                totalEtherSent += value; // Add to total ether sent
            } else if (transaction.to.toLowerCase() === address.toLowerCase()) {
                totalReceivedTransactions++;
                totalEtherReceived += value;
                maxReceivedValue = Math.max(maxReceivedValue, value);
                uniqueAddresses.add(transaction.from.toLowerCase());
            }

            firstTransactionTime = Math.min(firstTransactionTime, time);
            lastTransactionTime = Math.max(lastTransactionTime, time);
        });

        totalTransactions = totalSentTransactions + totalReceivedTransactions;
        etherReceivedPerTransaction = totalReceivedTransactions > 0 ? totalEtherReceived / totalReceivedTransactions : 0;

        const timeDiffMinutes = (lastTransactionTime - firstTransactionTime) / 60;
        const uniqueAddressCount = uniqueAddresses.size;

        document.getElementById('totalSentTransactions').textContent = totalSentTransactions;
        document.getElementById('totalReceivedTransactions').textContent = totalReceivedTransactions;
        document.getElementById('totalTransactions').textContent = totalTransactions;
        document.getElementById('totalEtherReceived').textContent = totalEtherReceived.toFixed(4) + ' Ether';
        document.getElementById('totalEtherSent').textContent = totalEtherSent.toFixed(4) + ' Ether'; // Display total ether sent
        document.getElementById('timeDifference').textContent = timeDiffMinutes.toFixed(2) + ' minutes';
        document.getElementById('maxReceivedValue').textContent = maxReceivedValue.toFixed(4) + ' Ether';
        document.getElementById('uniqueAddresses').textContent = uniqueAddressCount;
        document.getElementById('etherReceivedPerTransaction').textContent = etherReceivedPerTransaction.toFixed(4) + ' Ether';
    } catch (error) {
        console.error('Error fetching address information:', error);
    }
}

/* Details button */
document.addEventListener("DOMContentLoaded", function() {
    const detailsButton = document.getElementById("detailsButton");
    detailsButton.addEventListener("click", function() {
        window.location.href = "file:///C:/Users/Sairam%20Gudeli/Desktop/Final%20Project/Features/Address%20Details%202/Details/index.html";
    });
});

function submitAddress() {
    var address = document.getElementById("address").value;
    var apiKey = "1KQ2ETIZF1M4864CKFY8IU539CIH1SXZ28";

    fetchTransactions(apiKey, address);
}


function fetchTransactions(apiKey, address) {
    var apiUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&apikey=${apiKey}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.status === "1") {
            visualizeTransactionPath(data.result);
        } else {
            document.getElementById("output").innerText = "No transactions found.";
        }
    })
    .catch(error => console.error('Error:', error));
}

function visualizeTransactionPath(transactions) {
    var nodes = {};
    var edges = [];

    transactions.forEach(tx => {
        if (!nodes[tx.from]) {
            nodes[tx.from] = { id: tx.from, image: getImageUrl(getExchangeFromAddress(tx.from)), title: `Address: ${tx.from}<br>Exchange: ${getExchangeFromAddress(tx.from)}<br>Time: ${new Date(tx.timeStamp * 1000).toLocaleString()}<br>Value: ${weiToEther(tx.value)} Ether` };
        }
        if (!nodes[tx.to]) {
            nodes[tx.to] = { id: tx.to, image: getImageUrl(getExchangeFromAddress(tx.to)), title: `Address: ${tx.to}<br>Exchange: ${getExchangeFromAddress(tx.to)}<br>Time: ${new Date(tx.timeStamp * 1000).toLocaleString()}<br>Value: ${weiToEther(tx.value)} Ether` };
        }
        edges.push({ from: tx.from, to: tx.to, color: { color: 'Grey' }});
    });

    renderGraph(nodes, edges);
}

function getExchangeFromAddress(address) {
    if (address.startsWith('0xe98')) {
        return 'Binance';
    } else if (address.startsWith('0x1')) {
        return 'OpenSea';
    } else if (address.startsWith('0x2')) {
        return 'HTX';
    } else if (address.startsWith('0x3')) {
        return 'Metamask';
    } else if (address.startsWith('0x4')) {
        return 'Kraken';
    } else if (address.startsWith('0x5')) {
        return 'Gemini';
    } else if (address.startsWith('0x6')) {
        return 'Bybits Deposit';
    } else if (address.startsWith('TBA6C')) {
        return 'Gate.io';
    } else if (address.startsWith('0x7')) {
        return 'Orbiter';
    } else if (address.startsWith('0x8')) {
        return 'Uniswap';
    } else if (address.startsWith('0x9')) {
        return 'OpenSea';
    
    }else if (address.startsWith('0xb')) {
        return 'Binance';
    } else {
        return 'Unknown'; // Default to 'Unknown' if no match
    }
}

function getImageUrl(exchange) {
    switch (exchange) {
        case 'Binance':
            return 'Binance.png';
        case 'OpenSea':
            return 'Opensea.png';
        case 'Bittrex':
            return 'HTX.png';
        case 'Metamask':
            return 'metamask.png';
        case 'Kraken':
            return 'Kraken.png';
        case 'Gemini':
            return 'Gemini.png';
        case 'Bybits Deposit':
            return 'Bybit.png';
        case 'Gate.io':
            return 'Gate.io.png';
        case 'Orbiter':
            return 'Orbitor.png';
        case 'Uniswap':
            return 'uniswap.png';
        
        default:
            return 'eth.png'; // Default image if no match
    }
}

function weiToEther(wei) {
    return wei / 1e18; // 1 Ether = 10^18 Wei
}

function renderGraph(nodes, edges) {
    var output = document.getElementById("output");
    output.innerHTML = ""; // Clear previous content

    var graphData = {
        nodes: Object.values(nodes),
        edges: edges
    };

    var options = {
        nodes: {
            shape: 'image',
            image: 'address.png',
            size: 40
        },
        edges: {
            width: 2,
            color: 'gray'
        },
        physics: {
            enabled: true
        }
    };

    var network = new vis.Network(output, graphData, options);
}

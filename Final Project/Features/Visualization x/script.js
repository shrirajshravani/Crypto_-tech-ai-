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
            nodes[tx.from] = { id: tx.from, image: 'eth.png', title: `Address: ${tx.from}<br>Exchange: ${getExchangeFromAddress(tx.from)}<br>Time: ${new Date(tx.timeStamp * 1000).toLocaleString()}<br>Value: ${weiToEther(tx.value)} Ether` };
        }
        if (!nodes[tx.to]) {
            nodes[tx.to] = { id: tx.to, image: 'eth.png', title: `Address: ${tx.to}<br>Exchange: ${getExchangeFromAddress(tx.to)}<br>Time: ${new Date(tx.timeStamp * 1000).toLocaleString()}<br>Value: ${weiToEther(tx.value)} Ether` };
        }
        edges.push({ from: tx.from, to: tx.to, color: { color: 'Grey' }});
    });

    renderGraph(nodes, edges);

    // Add hover feature to display exchange associated with Ethereum address
    var network = new vis.Network(output, graphData, options);
    network.on("hoverNode", function (params) {
        var nodeId = params.node;
        var node = nodes[nodeId];
        var tooltip = document.createElement('div');
        tooltip.innerHTML = `<b>Exchange:</b> ${node.title.split('<br>')[1].split(': ')[1]}`; // Extract exchange info from node's title
        tooltip.style.position = 'absolute';
        tooltip.style.left = params.event.clientX + 'px';
        tooltip.style.top = params.event.clientY + 'px';
        tooltip.style.backgroundColor = 'white';
        tooltip.style.border = '1px solid black';
        document.body.appendChild(tooltip);
    });
}

function getExchangeFromAddress(address) {
    if (address.startsWith('0xe98')) {
        return 'Binance';
    } else if (address.startsWith('0xbba')) {
        return 'OpenSea';
    } else if (address.startsWith('0xFBb')) {
        return 'Bittrex';
    } else if (address.startsWith('0xc02')) {
        return 'Metamask';
    } else if (address.startsWith('f3a0')) {
        return 'Mexc';
    } else if (address.startsWith('0x799')) {
        return 'Huobi';
    } else if (address.startsWith('0x03')) {
        return 'Bybits Deposit';
    } else if (address.startsWith('TBA6C')) {
        return 'Gate.io';
    } else if (address.startsWith('0xd92')) {
        return 'Orbiter';
    } else if (address.startsWith('0x61')) {
        return 'Bitstamp';
    } else if (address.startsWith('0x0d5d')) {
        return 'Poloniex';
    } else if (address.startsWith('0x7b6f')) {
        return 'Binance Wallet';
    } else if (address.startsWith('0xd551')) {
        return 'Coinbase Wallet';
    } else if (address.startsWith('0x0e57')) {
        return 'Bitfinex Wallet';
    } else if (address.startsWith('0x742d')) {
        return 'Kraken Wallet';
    } else if (address.startsWith('0x3f5b')) {
        return 'Huobi Wallet';
    } else if (address.startsWith('0x338a')) {
        return 'KuCoin Wallet';
    } else if (address.startsWith('0x3e22')) {
        return 'Bitflyer';
    } else if (address.startsWith('0x01c')) {
        return 'BitMEX';
    } else if (address.startsWith('0x1c')) {
        return 'Bitso';
    } else if (address.startsWith('0x100')) {
        return 'Bybit';
    } else if (address.startsWith('0x49')) {
        return 'CEX.IO';
    } else if (address.startsWith('0x593')) {
        return 'Coincheck';
    } else if (address.startsWith('0x3ed')) {
        return 'CoinEx';
    } else if (address.startsWith('0x1f4')) {
        return 'Deribit';
    } else if (address.startsWith('0x9e')) {
        return 'HitBTC';
    } else if (address.startsWith('0x52')) {
        return 'Huobi Global';
    } else if (address.startsWith('0xdf')) {
        return 'KeepKey';
    } else if (address.startsWith('0x01c')) {
        return 'MEW (MyEtherWallet)';
    } else if (address.startsWith('0x2c')) {
        return 'imToken';
    } else if (address.startsWith('0x1820')) {
        return 'Trustee Wallet';
    } else if (address.startsWith('0x1b')) {
        return 'Math Wallet';
    } else {
        return 'Unknown'; // Default to 'Unknown' if no match
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

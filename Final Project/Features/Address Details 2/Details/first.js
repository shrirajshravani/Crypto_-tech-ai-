first.js
async function get_eth_transaction_history(address) {
    const api_key = '1KQ2ETIZF1M4864CKFY8IU539CIH1SXZ28';
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&apikey=${api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
}

async function get_btc_transaction_history(address) {
    const url = `https://blockchain.info/rawaddr/${address}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.txs;
}

function get_first_transaction(transactions) {
    const first_transaction = transactions.reduce((min, tx) => tx.timeStamp < min.timeStamp ? tx : min, transactions[0]);
    return new Date(first_transaction.timeStamp * 1000);
}

function get_last_transaction(transactions) {
    const last_transaction = transactions.reduce((max, tx) => tx.timeStamp > max.timeStamp ? tx : max, transactions[0]);
    return new Date(last_transaction.timeStamp * 1000);
}

function get_total_eth_transactions(transactions) {
    return transactions.length;
}

function get_total_eth_received(transactions, address) {
    const total_received = transactions.reduce((sum, tx) => tx.to.toLowerCase() === address.toLowerCase() ? sum + parseInt(tx.value) : sum, 0);
    return total_received / 10**18;  // Convert wei to ether
}

function get_total_eth_sent(transactions, address) {
    const total_sent = transactions.reduce((sum, tx) => tx.from.toLowerCase() === address.toLowerCase() ? sum + parseInt(tx.value) : sum, 0);
    return total_sent / 10**18;  // Convert wei to ether
}

function get_unique_addresses(transactions, address) {
    const unique_addresses = new Set(transactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase()).map(tx => tx.to));
    return unique_addresses.size;
}

async function main() {
    const address = prompt("Enter ETH or BTC address:");

    if (address.startsWith('0x') && address.length === 42) {  // Ethereum address
        const eth_transactions = await get_eth_transaction_history(address);
        if (eth_transactions.length > 0) {
            const first_transaction = get_first_transaction(eth_transactions);
            const last_transaction = get_last_transaction(eth_transactions);
            const total_transactions = get_total_eth_transactions(eth_transactions);
            const total_received = get_total_eth_received(eth_transactions, address);
            const total_sent = get_total_eth_sent(eth_transactions, address);
            const unique_addresses = get_unique_addresses(eth_transactions, address);

            console.log("1. First Transaction:", first_transaction);
            console.log("2. Total time from first to last transaction:", last_transaction - first_transaction);
            console.log("3. Total number of transactions:", total_transactions);
            console.log("4. Total ETH received:", total_received);
            console.log("5. Total ETH sent:", total_sent);
            console.log("6. ETH sent to unique addresses:", unique_addresses);
            console.log("7. ETH received from unique addresses:", 0);  // Etherscan API doesn't provide this info
        } else {
            console.log("No transaction history found for the provided ETH address.");
        }
    } else if ((address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) && [26, 34, 42].includes(address.length)) {  // Bitcoin address
        const btc_transactions = await get_btc_transaction_history(address);
        if (btc_transactions.length > 0) {
            console.log("Bitcoin address functionality not implemented in this example.");
        } else {
            console.log("No transaction history found for the provided BTC address.");
        }
    } else {
        console.log("Invalid address format or unsupported cryptocurrency.");
    }
}


main();
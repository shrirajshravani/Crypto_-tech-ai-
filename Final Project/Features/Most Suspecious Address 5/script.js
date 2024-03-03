function handleFile() {
    var fileInput = document.getElementById('csv-file');
    var file = fileInput.files[0];
    
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                var data = results.data;
                analyzeTransactions(data);
            }
        });
    } else {
        alert('Please select a CSV file.');
    }
  }
  
  function analyzeTransactions(data) {
    // Convert CSV data to DataFrame
    var df = parseCSVToDataFrame(data);
  
    // Group by sender and recipient and count the number of transactions
    var senderCounts = countOccurrences(df, 'sender');
    var recipientCounts = countOccurrences(df, 'recipient');
  
    // Filter senders and recipients with more than 10 transactions
    var sendersManyTransactions = filterTransactions(senderCounts, 10);
    var recipientsManyTransactions = filterTransactions(recipientCounts, 10);
  
    // Display the results
    displayResults(sendersManyTransactions, recipientsManyTransactions);
  }
  
  function parseCSVToDataFrame(data) {
    // Assuming the first row contains column headers
    var headers = data[0];
    var rows = data.slice(1);
    var df = {};
    for (var i = 0; i < headers.length; i++) {
        df[headers[i]] = [];
    }
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < headers.length; j++) {
            df[headers[j]].push(rows[i][j]);
        }
    }
    return df;
  }
  
  function countOccurrences(df, column) {
    var counts = {};
    for (var i = 0; i < df[column].length; i++) {
        var value = df[column][i];
        counts[value] = counts[value] ? counts[value] + 1 : 1;
    }
    return counts;
  }
  
  function filterTransactions(counts, threshold) {
    var filtered = {};
    for (var key in counts) {
        if (counts.hasOwnProperty(key) && counts[key] > threshold) {
            filtered[key] = counts[key];
        }
    }
    return filtered;
  }
  
  function displayResults(senders, recipients) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<h2>Senders with more than 10 transactions:</h2>";
    for (var sender in senders) {
        if (senders.hasOwnProperty(sender)) {
            resultDiv.innerHTML += sender + ": " + senders[sender] + "<br>";
        }
    }
    resultDiv.innerHTML += "<h2>Recipients with more than 10 transactions:</h2>";
    for (var recipient in recipients) {
        if (recipients.hasOwnProperty(recipient)) {
            resultDiv.innerHTML += recipient + ": " + recipients[recipient] + "<br>";
        }
    }
  }
  function displayResults(senders, recipients) {
      var resultDiv = document.getElementById('result');
      var tableHTML = "<h2>Senders with more than 10 transactions:</h2><table><tr><th>Sender</th><th>Number of Transactions</th></tr>";
      for (var sender in senders) {
          if (senders.hasOwnProperty(sender)) {
              tableHTML += "<tr><td>" + sender + "</td><td>" + senders[sender] + "</td></tr>";
          }
      }
      tableHTML += "</table><h2>Recipients with more than 10 transactions:</h2><table><tr><th>Recipient</th><th>Number of Transactions</th></tr>";
      for (var recipient in recipients) {
          if (recipients.hasOwnProperty(recipient)) {
              tableHTML += "<tr><td>" + recipient + "</td><td>" + recipients[recipient] + "</td></tr>";
          }
      }
      tableHTML += "</table>";
      resultDiv.innerHTML = tableHTML;
    }
    
  
  
  
// Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        processData(contents);
    };

    reader.readAsText(file);
}

// Function to process CSV data
function processData(csvData) {
    // Parse CSV data
    var lines = csvData.split(/\r\n|\n/);
    var data = {
        value: [],
        gas_used: [],
        time: [],
        labels: []
    };

    for (var i = 1; i < lines.length; i++) {
        var parts = lines[i].split(',');
        if (parts.length >= 4) {
            data.value.push(parseFloat(parts[0]));
            data.gas_used.push(parseFloat(parts[1]));
            data.time.push(parseFloat(parts[2])); // Assuming time is in the 3rd column
            data.labels.push(parseInt(parts[3])); // Assuming labels are in the 4th column
        }
    }

    // Create trace for the scatter plot
    var trace = {
        x: data.value,
        y: data.gas_used,
        z: data.time,
        mode: 'markers',
        marker: {
            color: data.labels,
            colorscale: 'Viridis',
            size: 10,
            line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5
            }
        },
        type: 'scatter3d'
    };

    // Create data array
    var plotData = [trace];

    // Define layout
    var layout = {
        title: 'Transaction Value vs. Gas Used vs. Time with K-Means Clusters',
        width: 1000, // Set the width of the plot
        height: 1000, // Set the height of the plot
        scene: {
            xaxis: { title: 'Transaction Value' },
            yaxis: { title: 'Gas Used' },
            zaxis: { title: 'Time' }
        }
    };

    // Plot using Plotly.js
    Plotly.newPlot('scatter-plot', plotData, layout);
}

// Listen for file input change
document.getElementById('file-input').addEventListener('change', handleFileUpload);

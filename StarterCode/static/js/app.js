// Use D3 to fetch the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the dashboard
function init() {
    d3.json(url).then(data => {
        // Populate dropdown menu
        var select = d3.select("#selDataset");
        data.names.forEach(name => {
            select.append("option").text(name).property("value", name);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = data.names[0];
        updateCharts(firstSample);
        updateMetadata(firstSample);
    });
}

// Function to update the bar and bubble chart
function updateCharts(sample) {
    d3.json(url).then(data => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Bar chart
        var barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTUs Found in Individual",
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU IDs"}
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// Function to build the metadata panel
function updateMetadata(sample) {
    d3.json(url).then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var displayPanel = d3.select("#sample-metadata");

        displayPanel.html(""); // Clear existing metadata

        Object.entries(result).forEach(([key, value]) => {
            displayPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to handle the change event
function optionChanged(newSample) {
    // Update the charts and metadata with the new sample
    updateCharts(newSample);
    updateMetadata(newSample);
}

// Initialize the dashboard
init();

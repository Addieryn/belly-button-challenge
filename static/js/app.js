// Build the metadata panel
function buildMetadata(sample_id) {
  d3.json("samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filtered_meta = metadata.filter(sample => sample.id == sample_id);
    let results = filtered_meta[0]   

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(results).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`)
  })
  });
}

// function to build both charts
function buildCharts(sample_id) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered_data = samples.filter(sample => sample.id == sample_id)
    let results = filtered_data[0]  

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;

    // Build a Bubble Chart
    let bubble_layout = {
      title : "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
    }

    let bubble_data = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }]
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubble_data, bubble_layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let slicedData = otu_ids.slice(0, 10).map(otuID => `OYU ${otuID}`).reverse()

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found"
    }

    let bar_data = [{
      y: slicedData,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: "h",
      name: "Number of Bacteria"  
    }]
    // Render the Bar Chart
    Plotly.newPlot('bar', bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown_id = d3.select("#selDataset")


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sample_names.forEach((samples) => {
      dropdown_id.append("option").text(samples).property("value", samples)
    })

    // Get the first sample from the list
    let first = sample_names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first)
    buildMetadata(first)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();

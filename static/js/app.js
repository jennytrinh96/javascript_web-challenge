
// Function that populates the metadata
function demoInfo(sample)
{
    // console.log(sample);

    // Load data with d3
    d3.json('data/samples.json').then((data) =>
    {

        // Grab all of the metadata
        let metaData = data.metadata;
        // console.log(metaData);

        // Filter based on the value of the sample
        // sampleResult object will be referred as sampleResult id in metaData which will be == to sample and will be referenced below in other functions
        // Should return 1 result in an array based on the dataset
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        // console.log(result);

        // Access index 0 from the array - just need the demographics info
        let resultData = result[0];
        // console.log(resultData);

        // Clear the metadata out after each click, so that when clicking on to another sample, demobox clears and changes to appropriate sample
        // .html("") clears out the text
        // This allows for the Object.entries to pull new data and place into box each time a new sample is clicked 
        d3.select("#sample-metadata").html("");

        // Use Object.entries to get the value key pairs
        // append key pairs (age, bbtype, etc..) from console (resultData) to Demographic info box (div id= 'sample-metadata')

        Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data/demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });

    });

}

// Function that build bar chart
function buildBarChart(sample)
{
    // console.log(sample);

    // Load data with d3 library
    // let data1 = d3.json('data/samples.json');
    // console.log(data1);

    // Load data with d3
    d3.json('data/samples.json').then((data) =>
    {

        // Grab all of the samples data
        let sampleData = data.samples;
        // console.log(sampleData);

        
        // Filter based on the value of the sample
        // sampleResult object will be referred as sampleResult id in sampleData which will be == to sample and will be referenced below in other functions
        // Should return 1 result in an array based on the dataset
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        // console.log(result);

        // Access index 0 from the array 
        let resultData = result[0];
        // console.log(resultData);

        // Parse and assign variables for otu_ids, otu_labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // Create trace data for bar chart
        let barTrace = 
        {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar", 
            orientation: "h"
        }

        // Create layout for bar chart
        let barLayout = 
        {
            title: 'Top 10 Belly Button Bacteria'
        };

        // Create barChart with Plotly
        // 'bar' references div class 'bar' in index html
        // brackets [ ] in barTrace makes it an array
        Plotly.newPlot("bar", [barTrace], barLayout);
    });
    
}

// Function that builds the bubble chart
function buildBubbleChart(sample)
{
    // Load data with d3
    d3.json('data/samples.json').then((data) =>
    {

        // Grab all of the samples data
        let sampleData = data.samples;
        // console.log(sampleData);

        
        // Filter based on the value of the sample
        // sampleResult object will be referred as sampleResult id in sampleData which will be == to sample and will be referenced below in other functions
        // Should return 1 result in an array based on the dataset
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        // console.log(result);

        // Access index 0 from the array 
        let resultData = result[0];
        // console.log(resultData);

        // Parse and assign variables for otu_ids, otu_labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // Create trace data for bubble chart
        let bubbleTrace = 
        {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            mode: "markers", 
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        // Create layout for bar chart
        let bubbleLayout = 
        {
            title: 'Bacteria Cultures Per Sample',
            hovermode: 'closest',
            xaxis: {title: "OTU ID"}
        };

        // Create barChart with Plotly
        // 'bar' references div class 'bar' in index html
        // brackets [ ] in barTrace makes it an array
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
    });
}

// Function that initilizes everything
function init(data)

{
    // Check if console is reading data
    // console.log(data);

    // Access the dropdown selector from index.html
    // div = 'well', select id= 'selDataset'
    // class = .blah, id= #blah

    // Reference the selector
    var select = d3.select("#selDataset");

        // Create a variable to access 'names' from data
        let sampleNames = data.names;
        // console.log(sampleNames);

        // Create a forEach to create an option in the dropdown in html for each subject name in the selector
        // For each 'sample' name create an option and append to html as text
        sampleNames.forEach((sample) => 
        {
            select.append("option")
            .text(sample)
            .property("value", sample);
        });
        // When initilized, pass in the info for the first sample found
        let sample1 = sampleNames[0];

        // Call the function to build the metadata
        demoInfo(sample1);

        // Call the function to build the bar chart
        buildBarChart(sample1);

        // Call function to build bubble chart
        buildBubbleChart(sample1);
        
}

// Function that updates the dashboard
function optionChanged(item)
{
    // Prints the sampleName for each subject clicked in the dropdown menu and prints in console
    // console.log(item);

    // Call the update to the metadata
    // Passes in the value of that item and update the demobox in respective of that item
    demoInfo(item);

    // Call funciton to build the bar chart
    buildBarChart(item);

    // Call function to build bubble chart
    buildBubbleChart(item);
}

// Function that executes the above functions
d3.json("data/samples.json").then(
    init
);




/* 
To do: 

Create a function (init) that initilizes all the functions
Can use d3.json at the end to execute

Under init() do the following:
    Reference the selector from html <select> aka the dropdown

    Load the test subject 'names' from data create a variable to hold it, sampleNames

    Create a forEach to create an option in the dropdown in html so that each sample name is listed as text in the dropdown menu under the selector 


Create a function optionChanged(subject) so that it can reference each sampleName as subject when clicked on and prints into console, save for later

Build Demographic box and load metadata into it

When function is executed, the first sample in index 0 will load first
Create this code under sampleName.forEach

demoInfo box will now see and reference index 0 as first sample and will load in the info 

Under function demoInfo()
    Load metadata using d3 library and create a variable metaData

    Filter the metaData so that an object will refer to the metaData.id and referencing to sample 
        ** .filter(object => object.id == sample) **

    Assign variable resultData to only see index 0 of metadata array to see info like id, ethnicity, gender, etc..

    Use Object.entries to append key pairs (from resultData[0] age, id, gender etc..)
        Use d3.select to select the info from the key pairs and append to '#sample-metadata' (demographic info box) from html and insert as f-string

        Use d3.select to select the html tag '#sample-metadata' to clear out the demographic info box whenever a new sample is clicked. Otherwise will create a long list of samples rather than clearing out box. 


Next build the graphs:

    Function buildBarChart to build bar chart - buildBarChart(sample)

    Create calls in the demoInfo and init functions to execute buildBarChart functions -  buildBarChart(item), buildBArChart(sample)

    Create Trace datas and plot

    Do same for bubble chart

*/
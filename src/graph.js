const Chart = require('chart.js');
const fs = require('fs');
const $ = require('jQuery');

var tempReads = [];
var thrustReads = [];
var timeReads = [];

// Add functionality to buttons
$("#load").click(() => {
    //loadFromFile();
    $("#fileElem").click();
});
$("#reset").click(() => {
    resetData();
    updateChart(myChart);
    $(".graphContainer").hide();
    $("#spImp").hide();
});

// Updates chart
function updateChart(chart) {
    chart.data.labels = timeReads;
    chart.data.datasets[0].data = tempReads;
    chart.data.datasets[1].data = thrustReads;
    chart.update();
}

// Loads launch data from JSON file
function loadFromFile(files) {
    fs.readFile(files[0].path, 'utf8', (err, readouts) => {
        if (err) {
            throw err;
        }
        
        try {
            var parsedReadouts = JSON.parse(readouts);
        } catch (err) {
            alert(`Something is wrong with your file: \n ${err}`);
            return;
        }

        for (var index in parsedReadouts) {
            tempReads.push(parsedReadouts[index].temp - 273);
            thrustReads.push(parsedReadouts[index].thrust);
            timeReads.push(parsedReadouts[index].time / 1000);
        }        
        updateChart(myChart);
        $(".graphContainer").show();
        $("#spImp").show();
        $("#spImp").text(`Special impuls: ${specificImpuls().toFixed(2)} N`);
    });
}

// Reset data
function resetData() {
    tempReads = [];
    thrustReads = [];
    timeReads = [];
}

// Returns Specific Impuls
function specificImpuls() {
    var borderVal = 0.3;
    var beginIdx = [];
    var endIdx = [];
    var thrustSum = 0;
    var timeSum = 0;
    var idxSum = 0;

    for (var i = 0; i < thrustReads.length; i++) {
        if (thrustReads[i] > borderVal && beginIdx.length == endIdx.length) {
            beginIdx.push(i);
            thrustSum += thrustReads[i];
        } else if (thrustReads[i] > borderVal) {
            thrustSum += thrustReads[i];
        } else if (beginIdx.length > endIdx.length) {
            endIdx.push(i-1);
        }
    }

    for (var i = 0; i < beginIdx.length; i++) {
        timeSum += timeReads[endIdx[i]] - timeReads[beginIdx[i]];
        idxSum += endIdx[i] - beginIdx[i] + 1;
    }
    return thrustSum / idxSum * timeSum * 10; 
}

// Creating chart
var ctx = document.getElementById("chart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            borderColor: 'rgb(255, 99, 132)',
            data: []
        }, {
            label: 'Thrust',
            borderColor: 'rgb(237, 216, 146)',
            data: []
        }]
    },
    options: {
        responsive: true,
        legend: {
            labels: {
                fontColor: 'white',
                fontFamily: 'Helvetica'
            }
        }
    }
});
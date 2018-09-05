const Chart = require('chart.js');
const axios = require('axios');

const serverUrl = 'http://127.0.0.1:8888';

var tempReads = [];
var thrustReads = [];

function sendData() {
    axios.post(serverUrl)
}

function getData() {
    axios.get(serverUrl)
        .then(data => {
            if (!Number.isInteger(data.data)) {
                data.data = data.data.split()
                thrustReads.push(data.data[0]);
                tempReads.push(data.data[1]);
                updateChart(myChart);
            }
        })
        .catch(err => { console.log(err) });
}

function updateChart(chart) {
    chart.data.labels.push(chart.data.datasets[0].data.length + 1);
    chart.data.datasets[0].data = tempReads;
    chart.data.datasets[1].data = thrustReads;
    chart.update();
}

function toCsv() {
    var csv = '';
    for (var i = 0; i < tempReads.length; i++){
        csv += tempReads[i] + ',' + thrustReads[i];
    }
    return csv;
}

function downloadCSV() {  
    var data, filename, link;
    var csv = toCsv();

    filename = 'readouts.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

var interval;

function launch() {
    launched = true;
    interval = setInterval(getData, 50);
    sendData();
}

function stop() {
    launched = false;
    clearInterval(interval);
    downloadCSV();
}


var btn = document.getElementById("btn");
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
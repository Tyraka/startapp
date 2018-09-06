const Chart = require('chart.js');
const axios = require('axios');

const serverUrl = 'http://127.0.0.1:8888';

var tempReads = [];
var thrustReads = [];
var launched = false;

function sendData() {
    axios.post(serverUrl)
}

function getData() {
    axios.get(serverUrl)
        .then(data => {
            if (!Number.isInteger(data.data)) {
                console.log(data.data);
                data.data = data.data.split(",")
                if(Number.isInteger(Number(data.data[0])) && Number.isInteger(Number(data.data[1]))){
                    thrustReads.push(data.data[0]);
                    tempReads.push(data.data[1]);
                    document.getElementById('thrustbar').style.width = data.data[0]*100+'%';
                    document.getElementById('tempbar').style.width = data.data[1]*100+'%';
                }
                updateChart(myChart);
            }
        })
        .catch(err => { console.log(err) });
}

function updateChart(chart) {
    //correct time labaling
    chart.data.labels.push((chart.data.datasets[0].data.length + 1)/4);
    chart.data.datasets[0].data = tempReads;
    chart.data.datasets[1].data = thrustReads;
    chart.update();
}

function toCsv() {
    var csv = 'thrust, temp\r\n';
    for(var i = 0; i < tempReads.length; i++){
        csv += thrustReads[i] + ',' + tempReads[i];
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
    interval = setInterval(getData, 250);
    sendData();
    startBtn = document.getElementById('start');
    startBtn.classList.remove('startBtn');
    startBtn.classList.add('stopBtn');
    startBtn.innerHTML = 'Stop';
}

function stop() {
    launched = false;
    clearInterval(interval);
    startBtn = document.getElementById('start');
    startBtn.classList.remove('stopBtn');
    startBtn.classList.add('startBtn');
    startBtn.innerHTML = 'Start';
}

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
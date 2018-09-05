const Chart = require('chart.js');


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
    console.log('updated');
}

var ctx = document.getElementById("chart").getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1', '2'],
        datasets: [{
            label: 'Temperature',
            borderColor: 'rgb(255, 99, 132)',
            data: [1, 0.5]
        }]
    },
    options: {
        responsive: false
    }
});

    

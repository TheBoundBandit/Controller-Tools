import Chart from 'chart.js/auto'

const chartEl = document.getElementById('pattern-chart');

/*
actualData  = [{xAxisName: DATA, yAxisName: DATA}]
data = {
    lables: [yAxisLabels],
    datasets: [
        {
            label: 'Name',
            data: [xAxisData],
            borderColor: COLOR,
            backGroundColor: Gradient,
            fill: 'start',
            pointStyle: 'circle'

        }
    ]
}*/

async function generateChart(data){
    const chartConfig = {
        type: 'line',
        data: data,
        options: {
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    }
    new Chart(
        //
    )
}
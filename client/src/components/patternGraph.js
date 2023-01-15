import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

export default function PatternGraph(props) {
    console.log(props);
    const chartRef = useRef(null);
    
    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            console.log('CanvasRenderingContext2D', chart.ctx);
            console.log('HTMLCanvasElement', chart.canvas);
        }
    }, []);

    const options = {
        scales: {
            y: {
                type: 'linear',
                axis: 'y',
                min: 0,
                max: 255,
                ticks: {
                    includeBounds: true,
                    stepSize: 5
                }
            },
            x: {
                type: 'linear',
                axis: 'x',
                min: 0
            }
        },
        elements: {
            line: {
                tension: 0.2
            }
        }
    }

    const data = {
        //labels: dataArray.map(row => row.x),
        datasets: [{
            label: 'Speed',
            data: [],
            borderColor: chartRef.current ? generateGradient(chartRef.current.ctx, chartRef.current.chartArea) : 'rgb(54, 162, 235)',
            backgroundColor:  chartRef.current ? generateGradient(chartRef.current.ctx, chartRef.current.chartArea, true) : 'rgb(54, 162, 235, 0.5)',
            borderWidth: 2
        }]
    }

    function readData() {
        const dataList = props.entries;
        let dataArray = [];
        let seconds = 0;
        let speed = 0;
        for (let i = 0; i < dataList.length; i++) {
            const entry = dataList[i];
            let value = Number(entry.value)
            if (entry.type === 'speed') {
                if (entry.unit === '%') {
                    value = Math.round(value * 2.55);
                }
                speed = value;
            }
            else {
                seconds += value;
                if (entry.type === 'transition') {
                    continue;
                }
            }
            dataArray.push({ x: seconds, y: speed });
        }

        const newData = {
            //labels: dataArray.map(row => row.x),
            datasets: [{
                label: 'Speed',
                data: dataArray,
                borderColor: chartRef.current ? generateGradient(chartRef.current.ctx, chartRef.current.chartArea) : 'rgb(54, 162, 235)',
                backgroundColor:  chartRef.current ? generateGradient(chartRef.current.ctx, chartRef.current.chartArea, true) : 'rgb(54, 162, 235, 0.5)',
                fill: 'start',
                //pointStyle: 'circle'
                borderWidth: 2
            }]
        }
        //console.log(dataArray);
        return newData;
    }

    function generateGradient(ctx, chartArea, transparent = false) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        let width, height, gradient;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            // Create the gradient because this is either the first render
            // or the size of the chart has changed
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            if (transparent) {
                gradient.addColorStop(0, 'rgb(54, 162, 235, 0.5)');
                gradient.addColorStop(0.5, 'rgb(255, 205, 86, 0.5)');
                gradient.addColorStop(1, 'rgb(255, 99, 132, 0.5)');
            }
            else {
                gradient.addColorStop(0, 'rgb(54, 162, 235)');
                gradient.addColorStop(0.5, 'rgb(255, 205, 86)');
                gradient.addColorStop(1, 'rgb(255, 99, 132)');
            }
        }
        return gradient;
    }

    return (
        <div className='chart-container'>
            <Line ref={chartRef} options={options} data={readData() ?? data} />
        </div>
    );
}
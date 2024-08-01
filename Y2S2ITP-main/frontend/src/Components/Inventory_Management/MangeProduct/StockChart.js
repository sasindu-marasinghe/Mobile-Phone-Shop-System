import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const StockChart = () => {
  const chartRef = useRef(null);
  const myChart = useRef(null); // Use useRef to persist the chart instance

  useEffect(() => {
    function getProducts() {
      axios
        .get('http://localhost:8175/product/')
        .then((res) => {
          if (myChart.current) {
            myChart.current.destroy(); // Destroy existing chart instance if it exists
          }
          renderChart(res.data);
        })
        .catch((err) => {
          alert(err.message);
        });
    }

    function renderChart(data) {
      const labels = data.map((product) => product.name);
      const counts = data.map((product) => product.countInStock);

      const ctx = chartRef.current.getContext('2d');
      myChart.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Count in Stock',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              height: '30px',
              width:'10px',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    getProducts();

    // Cleanup function to ensure chart is destroyed when component unmounts
    return () => {
      if (myChart.current) {
        myChart.current.destroy();
      }
    };
  }, []);

  return (
    <main>
      <canvas ref={chartRef} id="stockChart" width="1000" height="550"></canvas>
    </main>
  );
};

export default StockChart;

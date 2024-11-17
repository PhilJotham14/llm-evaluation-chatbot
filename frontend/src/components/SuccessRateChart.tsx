import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Register components with Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface SuccessRateChartProps {
    successCount: number;
    failureCount: number;
    className?: string;
}

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ successCount, failureCount, className }) => {
    const data = {
        labels: ['Successful Requests', 'Failed Requests'],
        datasets: [
            {
                data: [successCount, failureCount],
                backgroundColor: ['#36A2EB', '#FF6384'], // Blue for success, red for failure
                hoverBackgroundColor: ['#4BC0C0', '#FF9F40'],
            },
        ],
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-lg ${className}`}>
            <h3 className="text-xl font-semibold text-gray-800">Success Rate</h3>
            <Pie data={data} />
        </div>
    );
};

export default SuccessRateChart;

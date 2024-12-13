import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [sentimentData, setSentimentData] = useState({
    total_sentiments: { positive: 0, negative: 0, neutral: 0 },
    daily_sentiments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/feedback/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSentimentData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-700">Loading...</h1>
      </div>
    );
  }

  const { positive, negative, neutral } = sentimentData.total_sentiments || {};
  const dailySentiments = sentimentData.daily_sentiments || [];
  const dates = dailySentiments.map((entry) => entry.date);
  const dailyPositive = dailySentiments.map((entry) => entry.sentiments.positive);
  const dailyNegative = dailySentiments.map((entry) => entry.sentiments.negative);
  const dailyNeutral = dailySentiments.map((entry) => entry.sentiments.neutral);

  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: "Positive",
        data: dailyPositive,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Negative",
        data: dailyNegative,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Neutral",
        data: dailyNeutral,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: "Positive",
        data: dailyPositive,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Negative",
        data: dailyNegative,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Neutral",
        data: dailyNeutral,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
      },
    ],
  };

  return (
    <div className="w-screen h-screen p-8 flex flex-col gap-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Sentiment Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Daily Sentiments
          </h2>
          <div className="overflow-x-auto">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Trends Over Time
          </h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Total Sentiments
          </h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Backend_URL } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart, Bar } from "recharts";

const GenerateStressReport = () => {
  const { authUser } = useAuthContext();
  const [data, setStressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${Backend_URL}/api/stress/fetch/${authUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stress data");
        }
        const input = await response.json();
        setStressData(input);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authUser._id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Map categories to numerical values
  const categoryMapping = {
    "Very Good": 5,
    Good: 4,
    Neutral: 3,
    Bad: 2,
    "Very Bad": 1,
  };

  const timelineData = data.map((entry) => ({
    date: new Date(entry.createdAt).toLocaleString(),
    category: categoryMapping[entry.label] || 0,
  }));

  const categoryCounts = {
    "Very Good": 0,
    Good: 0,
    Neutral: 0,
    Bad: 0,
    "Very Bad": 0,
  };

  data.forEach((entry) => {
    categoryCounts[entry.label]++;
  });

  const categoryData = Object.entries(categoryCounts).map(([label, count]) => ({
    label,
    count,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stress Report</h1>

      {/* Timeline Chart with Horizontal Scroll */}
      <h2 className="text-xl mb-2">Timeline of Stress Levels</h2>
      <div className="overflow-x-auto border rounded-lg">
        <ResponsiveContainer
          width={Math.max(timelineData.length * 100, window.innerWidth - 100)}
          height={350}
        >
          <LineChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={0}
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              domain={[1, 5]}
              tickFormatter={(value) =>
                Object.keys(categoryMapping).find(
                  (key) => categoryMapping[key] === value
                )
              }
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="category" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution Chart */}
      <h2 className="text-xl mt-6 mb-2">Category Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categoryData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenerateStressReport;

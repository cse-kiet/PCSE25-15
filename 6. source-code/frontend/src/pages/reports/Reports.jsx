import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useAuthContext } from "../../context/AuthContext";
import { Backend_URL } from "../../constants";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Sliders,
} from "lucide-react";

import { Link } from "react-router-dom";

// Define emotion score mappings
const EMOTION_SCORES = {
  "Very Bad": -2,
  Bad: -1,
  Neutral: 0,
  Good: 1,
  "Very Good": 2,
};

// Define color scheme
const COLORS = {
  "Very Good": "#4ade80",
  Good: "#60a5fa",
  Neutral: "#facc15",
  Bad: "#f97316",
  "Very Bad": "#ef4444",
};

// Define stress level thresholds
const STRESS_LEVELS = {
  High: { threshold: -1, color: "#ef4444" },
  Moderate: { threshold: 0.5, color: "#facc15" },
  Low: { threshold: Infinity, color: "#4ade80" },
};

export default function MentalHealthDashboard() {
  const { authUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [stressData, setStressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    mentalScore: 0,
    stressLevel: "Moderate",
    categoryDistribution: {},
    volatilityIndex: 0,
    negativeStreaks: 0,
    weeklyTrend: 0,
    timeInNegative: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${Backend_URL}/api/stress/fetch/${authUser._id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setStressData(data);
        processData(data);
      } catch (error) {
        console.error("Error fetching stress data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser._id]);

  // Process the raw data to calculate all metrics
  const processData = (data) => {
    if (!data || data.length === 0) return;

    // 1. Add numerical scores to each entry
    const processedData = data.map((entry) => ({
      ...entry,
      numericalScore: EMOTION_SCORES[entry.label] || 0,
      weightedScore: EMOTION_SCORES[entry.label] * entry.score, // Confidence-weighted score
      date: new Date(entry.createdAt),
      formattedDate: new Date(entry.createdAt).toLocaleDateString(),
      formattedTime: new Date(entry.createdAt).toLocaleTimeString(),
    }));

    // Sort by date
    processedData.sort((a, b) => a.date - b.date);

    // 2. Calculate mental health score (average)
    const mentalScore =
      processedData.reduce((sum, entry) => sum + entry.numericalScore, 0) /
      processedData.length;

    // 3. Determine stress level
    let stressLevel = "Low";
    if (mentalScore <= STRESS_LEVELS.High.threshold) {
      stressLevel = "High";
    } else if (mentalScore <= STRESS_LEVELS.Moderate.threshold) {
      stressLevel = "Moderate";
    }

    // 4. Calculate category distribution
    const categoryDistribution = processedData.reduce((acc, entry) => {
      acc[entry.label] = (acc[entry.label] || 0) + 1;
      return acc;
    }, {});

    // 5. Calculate volatility index (frequency of significant changes)
    let volatilityCount = 0;
    for (let i = 1; i < processedData.length; i++) {
      const scoreDiff = Math.abs(
        processedData[i].numericalScore - processedData[i - 1].numericalScore
      );
      if (scoreDiff >= 2) volatilityCount++; // Significant jump (e.g., Good to Very Bad)
    }
    const volatilityIndex =
      processedData.length > 1
        ? volatilityCount / (processedData.length - 1)
        : 0;

    // 6. Calculate negative streaks (consecutive Very Bad or Bad)
    let currentStreak = 0;
    let negativeStreaks = 0;

    processedData.forEach((entry) => {
      if (entry.numericalScore <= -1) {
        currentStreak++;
        if (currentStreak === 3) {
          // Streak of length 3 or more
          negativeStreaks++;
        }
      } else {
        currentStreak = 0;
      }
    });

    // 7. Calculate weekly trend (last 7 days vs previous 7 days)
    let weeklyTrend = 0;
    if (processedData.length >= 7) {
      const lastWeekData = processedData.slice(-7);
      const prevWeekData = processedData.slice(-14, -7);

      if (prevWeekData.length > 0) {
        const lastWeekAvg =
          lastWeekData.reduce((sum, entry) => sum + entry.numericalScore, 0) /
          lastWeekData.length;
        const prevWeekAvg =
          prevWeekData.reduce((sum, entry) => sum + entry.numericalScore, 0) /
          prevWeekData.length;
        weeklyTrend = lastWeekAvg - prevWeekAvg;
      }
    }

    // 8. Calculate % time in negative states in last 24h
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const recent24hData = processedData.filter(
      (entry) => entry.date >= last24h
    );
    const negativeEntries = recent24hData.filter(
      (entry) => entry.numericalScore < 0
    );
    const timeInNegative =
      recent24hData.length > 0
        ? (negativeEntries.length / recent24hData.length) * 100
        : 0;

    // 9. Calculate 7-day moving average
    const movingAverages = [];
    const windowSize = 7;

    for (let i = windowSize - 1; i < processedData.length; i++) {
      const windowData = processedData.slice(i - windowSize + 1, i + 1);
      const windowAvg =
        windowData.reduce((sum, entry) => sum + entry.numericalScore, 0) /
        windowSize;

      movingAverages.push({
        date: processedData[i].date,
        formattedDate: processedData[i].formattedDate,
        value: windowAvg,
      });
    }

    // Prepare time series data
    const timeSeriesData = processedData.map((entry) => ({
      time: entry.formattedTime,
      date: entry.formattedDate,
      score: entry.numericalScore,
      weightedScore: entry.weightedScore,
      label: entry.label,
      confidence: entry.score,
    }));

    // Update state with calculated metrics
    setMetrics({
      mentalScore,
      stressLevel,
      categoryDistribution,
      volatilityIndex,
      negativeStreaks,
      weeklyTrend,
      timeInNegative,
      processedData,
      timeSeriesData,
      movingAverages,
    });
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  // Helper to create category distribution data for charts
  const getCategoryDistributionData = () => {
    return Object.keys(metrics.categoryDistribution || {}).map((key) => ({
      name: key,
      value: metrics.categoryDistribution[key],
      percentage: (metrics.categoryDistribution[key] / stressData.length) * 100,
    }));
  };

  // Get stress level color
  const getStressLevelColor = (level) => {
    return STRESS_LEVELS[level]?.color || "#facc15";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading mental health data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // Radar data for mental health indicators
  const radarData = [
    {
      subject: "Mental Score",
      value: Math.max(0, ((metrics.mentalScore + 2) / 4) * 100), // Normalize to 0-100
      fullMark: 100,
    },
    {
      subject: "Volatility",
      value: Math.max(0, 100 - metrics.volatilityIndex * 100), // Lower volatility is better
      fullMark: 100,
    },
    {
      subject: "Positive %",
      value: Math.max(0, 100 - metrics.timeInNegative),
      fullMark: 100,
    },
    {
      subject: "Weekly Trend",
      value: Math.max(0, ((metrics.weeklyTrend + 2) / 4) * 100), // Normalize to 0-100
      fullMark: 100,
    },
    {
      subject: "Streak Health",
      value: Math.max(0, 100 - metrics.negativeStreaks * 20), // Each streak reduces health
      fullMark: 100,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 absolute inset-0 ">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-6">Mental Health Analytics</h2>
        <div className="mt-4 text-center mb-4">
          <Link to="/">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Back to Home Page
            </button>
          </Link>
        </div>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "overview" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Dashboard Overview
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "trends" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("trends")}
          >
            Trend Analysis
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "metrics" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("metrics")}
          >
            Detailed Metrics
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "insights" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("insights")}
          >
            Insights & Recommendations
          </li>
        </ul>
        {/* Stress Level Indicator */}
        <div className="mt-12 p-4 rounded bg-gray-700">
          <h3 className="text-lg font-semibold mb-2">Current Stress Level</h3>
          <div
            className={`text-xl font-bold p-2 rounded text-center`}
            style={{
              backgroundColor: getStressLevelColor(metrics.stressLevel),
            }}
          >
            {metrics.stressLevel}
          </div>
          <div className="mt-2 text-sm text-gray-300">
            Mental Score: {metrics.mentalScore.toFixed(2)}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-6 space-y-8 w-full overflow-y-auto">
        {activeTab === "overview" && (
          <>
            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Mental Health Score
                </h3>
                <div className="flex items-center mt-2">
                  <div className="text-2xl font-bold">
                    {metrics.mentalScore.toFixed(2)}
                  </div>
                  {metrics.weeklyTrend > 0 ? (
                    <TrendingUp className="ml-2 text-green-500" size={20} />
                  ) : (
                    <TrendingDown className="ml-2 text-red-500" size={20} />
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {metrics.weeklyTrend > 0
                    ? `Improving (+${metrics.weeklyTrend.toFixed(2)})`
                    : `Declining (${metrics.weeklyTrend.toFixed(2)})`}
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Volatility Index
                </h3>
                <div className="flex items-center mt-2">
                  <div className="text-2xl font-bold">
                    {(metrics.volatilityIndex * 100).toFixed(1)}%
                  </div>
                  <Activity className="ml-2 text-blue-500" size={20} />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {metrics.volatilityIndex < 0.1
                    ? "Stable emotional state"
                    : "Fluctuating emotions"}
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Time in Negative
                </h3>
                <div className="flex items-center mt-2">
                  <div className="text-2xl font-bold">
                    {metrics.timeInNegative.toFixed(1)}%
                  </div>
                  {metrics.timeInNegative > 50 ? (
                    <AlertTriangle className="ml-2 text-red-500" size={20} />
                  ) : (
                    <div className="ml-2 w-5 h-5 rounded-full bg-green-500"></div>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">Last 24 hours</div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Negative Streaks
                </h3>
                <div className="flex items-center mt-2">
                  <div className="text-2xl font-bold">
                    {metrics.negativeStreaks}
                  </div>
                  <Sliders className="ml-2 text-purple-500" size={20} />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Periods of sustained distress
                </div>
              </div>
            </div>

            {/* Radar Chart and Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">
                  Mental Health Profile
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Mental Wellness"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">
                  Mood Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getCategoryDistributionData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage.toFixed(0)}%`
                      }
                    >
                      {getCategoryDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} entries (${(
                          (value / stressData.length) *
                          100
                        ).toFixed(1)}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Mental Health Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.timeSeriesData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[-2.5, 2.5]} ticks={[-2, -1, 0, 1, 2]} />
                  <Tooltip
                    formatter={(value) => [`Score: ${value}`, "Mental State"]}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" />
                  <ReferenceLine
                    y={-1}
                    stroke="rgba(239, 68, 68, 0.3)"
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={0.5}
                    stroke="rgba(74, 222, 128, 0.3)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-sm text-gray-500 mt-2 flex justify-between">
                <div>Red zone: High Stress (≤ -1)</div>
                <div>Yellow zone: Moderate Stress (-1 to 0.5)</div>
                <div>Green zone: Low Stress (≥ 0.5)</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "trends" && (
          <>
            {/* Moving Average */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">
                7-Day Moving Average
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.movingAverages || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis domain={[-2.5, 2.5]} ticks={[-2, -1, 0, 1, 2]} />
                  <Tooltip
                    formatter={(value) => [
                      `Average: ${value.toFixed(2)}`,
                      "7-Day Average",
                    ]}
                  />
                  <ReferenceLine y={0} stroke="#666" />
                  <ReferenceLine
                    y={-1}
                    stroke="rgba(239, 68, 68, 0.3)"
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={0.5}
                    stroke="rgba(74, 222, 128, 0.3)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Weighted Score with Confidence */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Weighted Score (by Confidence)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.timeSeriesData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "weightedScore"
                        ? `Weighted: ${value.toFixed(2)}`
                        : `Raw: ${value.toFixed(2)}`,
                      name === "weightedScore"
                        ? "Confidence-adjusted"
                        : "Raw Score",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weightedScore"
                    stroke="#8884d8"
                    name="Weighted Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#82ca9d"
                    strokeDasharray="3 3"
                    name="Raw Score"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-sm text-gray-500 mt-2">
                Weighted score accounts for confidence level in emotion
                detection
              </div>
            </div>

            {/* Frequency Bar Chart */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Mood Frequency Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCategoryDistributionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} entries`, "Frequency"]}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Frequency">
                    {getCategoryDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "metrics" && (
          <>
            {/* Detailed Metrics Table */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">
                Detailed Mental Health Metrics
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interpretation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Mental Health Score
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {metrics.mentalScore.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {metrics.mentalScore > 1
                          ? "Very Positive"
                          : metrics.mentalScore > 0
                          ? "Positive"
                          : metrics.mentalScore > -1
                          ? "Neutral to Slightly Negative"
                          : "Concerning"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Stress Level
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {metrics.stressLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Based on average mental health score
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Volatility Index
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {(metrics.volatilityIndex * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {metrics.volatilityIndex < 0.1
                          ? "Very stable emotional state"
                          : metrics.volatilityIndex < 0.2
                          ? "Moderately stable"
                          : "High emotional fluctuation"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Negative Streaks
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {metrics.negativeStreaks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Episodes of 3+ consecutive negative entries
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Weekly Trend
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {metrics.weeklyTrend.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {metrics.weeklyTrend > 0.3
                          ? "Significant improvement"
                          : metrics.weeklyTrend > 0
                          ? "Slight improvement"
                          : metrics.weeklyTrend > -0.3
                          ? "Slight decline"
                          : "Significant decline"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Time in Negative States (24h)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {metrics.timeInNegative.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {metrics.timeInNegative > 70
                          ? "Critical - mostly negative"
                          : metrics.timeInNegative > 50
                          ? "Concerning - majority negative"
                          : metrics.timeInNegative > 30
                          ? "Mixed emotions"
                          : "Mostly positive"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mood Percentages */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Mood Category Percentages
              </h3>
              <div className="flex flex-wrap gap-4">
                {getCategoryDistributionData().map((category, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${COLORS[category.name]}33` }}
                  >
                    <div className="text-lg font-semibold">{category.name}</div>
                    <div className="text-3xl font-bold mt-1">
                      {formatPercentage(category.percentage)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {category.value} entries
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "insights" && (
          <>
            {/* Insights and Recommendations */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">
                Insights & Recommendations
              </h3>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">
                  Mental Health Status
                </h4>
                <p className="text-gray-700">
                  {metrics.mentalScore > 0.5
                    ? "Your overall mental state appears positive. Continue your current practices and self-care routines."
                    : metrics.mentalScore > -0.5
                    ? "Your mental health is in a neutral zone. Consider incorporating more positive activities and stress reduction techniques."
                    : "Your mental health indicators suggest elevated stress levels. Consider reaching out for support and practicing more stress-relief activities."}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">
                  Volatility Analysis
                </h4>
                <p className="text-gray-700">
                  {metrics.volatilityIndex < 0.1
                    ? "Your emotional state is quite stable, which is a positive indicator of emotional regulation."
                    : metrics.volatilityIndex < 0.2
                    ? "You're experiencing some emotional fluctuations, which is normal but worth monitoring."
                    : "Your emotions appear to fluctuate significantly. Consider mindfulness practices to help stabilize your emotional responses."}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Trending Direction</h4>
                <p className="text-gray-700">
                  {metrics.weeklyTrend > 0.3
                    ? "Your mental health is showing significant improvement over the past week. Keep up the good work!"
                    : metrics.weeklyTrend > 0
                    ? "Your mental health is showing slight improvement lately. Continue with your positive practices."
                    : metrics.weeklyTrend > -0.3
                    ? "Your mental health is showing a slight downward trend. Consider adding more self-care activities."
                    : "Your mental health appears to be declining more significantly. Consider speaking with a mental health professional for support."}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Negative Periods</h4>
                <p className="text-gray-700">
                  {metrics.negativeStreaks === 0
                    ? "You haven't experienced prolonged negative periods, which is excellent."
                    : metrics.negativeStreaks === 1
                    ? "You've had one period of sustained negative emotions. Consider what factors may have contributed to this time."
                    : `You've experienced ${metrics.negativeStreaks} periods of sustained negative emotions. Try to identify patterns or triggers that might be contributing to these episodes.`}
                </p>
              </div>

              <div className="p-4 mt-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium mb-2">
                  Personalized Recommendations
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {metrics.mentalScore < -0.5 && (
                    <li>
                      Consider speaking with a mental health professional for
                      additional support.
                    </li>
                  )}
                  {metrics.volatilityIndex > 0.2 && (
                    <li>
                      Try mindfulness or meditation practices to help stabilize
                      emotional responses.
                    </li>
                  )}
                  {metrics.timeInNegative > 50 && (
                    <li>
                      Incorporate more positive activities into your daily
                      routine to counterbalance negative states.
                    </li>
                  )}
                  {metrics.negativeStreaks > 0 && (
                    <li>
                      Develop a "mental health emergency plan" for when you
                      notice the onset of negative streaks.
                    </li>
                  )}
                  <li>
                    Regular physical activity can help maintain positive mental
                    states.
                  </li>
                  <li>
                    Continue tracking your moods to identify patterns and make
                    informed adjustments.
                  </li>
                </ul>
              </div>
            </div>

            {/* Turning Points Detection */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Significant Turning Points
              </h3>
              <div className="overflow-x-auto">
                {metrics.processedData && metrics.processedData.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Significance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        // Find significant turning points
                        const turningPoints = [];
                        const data = metrics.processedData;

                        for (let i = 1; i < data.length; i++) {
                          const scoreDiff =
                            data[i].numericalScore - data[i - 1].numericalScore;
                          if (Math.abs(scoreDiff) >= 1.5) {
                            turningPoints.push({
                              date: new Date(data[i].date),
                              from: data[i - 1].label,
                              to: data[i].label,
                              change: scoreDiff,
                              significance: Math.abs(scoreDiff),
                            });
                          }
                        }

                        // Sort by significance
                        turningPoints.sort(
                          (a, b) => b.significance - a.significance
                        );

                        // Display top 5 turning points
                        return turningPoints.slice(0, 5).map((point, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {point.date.toLocaleDateString()}{" "}
                              {point.date.toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={
                                  point.change > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {point.from} → {point.to} (
                                {point.change > 0 ? "+" : ""}
                                {point.change.toFixed(1)})
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {point.significance >= 3
                                ? "Major shift"
                                : point.significance >= 2
                                ? "Significant change"
                                : "Notable change"}
                            </td>
                          </tr>
                        ));
                      })()}

                      {(() => {
                        const turningPoints = [];
                        const data = metrics.processedData;

                        for (let i = 1; i < data.length; i++) {
                          const scoreDiff =
                            data[i].numericalScore - data[i - 1].numericalScore;
                          if (Math.abs(scoreDiff) >= 1.5) {
                            turningPoints.push({
                              date: new Date(data[i].date),
                              from: data[i - 1].label,
                              to: data[i].label,
                              change: scoreDiff,
                              significance: Math.abs(scoreDiff),
                            });
                          }
                        }

                        if (turningPoints.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-6 py-4 text-center text-gray-500"
                              >
                                No significant turning points detected
                              </td>
                            </tr>
                          );
                        }

                        return null;
                      })()}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Not enough data to detect turning points
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Turning points represent significant shifts in emotional state
                that may indicate important life events or stressors
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

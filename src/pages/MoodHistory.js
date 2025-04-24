import { useEffect, useState } from "react";
import { useUser } from "./context/userContext";
import {
  ScatterChart,
  Scatter,
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MoodHistory(props) {
  const { logout, user } = useUser();
  const { setActiveTab, activeTab } = props;

  const [moodLogs, setMoodLogs] = useState([]);
  const moodToValue = {
    Sad: 1,
    Ennui: 2,
    Anxious: 3,
    Disgust: 4,
    Angry: 5,
    Happy: 6,
  };

  useEffect(() => {
    const fetchMoodLogs = async () => {
      const response = await fetch("/api/getMoods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, user: user }),
      });
      const data = await response.json();
      let transformed = data.content.map((log) => ({
        date: log.createdAt,
        moodValue: moodToValue[log.moodType],
      }));
      transformed = transformed.map((entry) => {
        const d = new Date(entry.date);
        return {
          timestamp: d.getTime(), // X-axis
          hour: d.getHours() + d.getMinutes() / 60, // Y-axis
          moodValue: entry.moodValue,
        };
      });
      console.log("value of transformed", transformed);
      setMoodLogs(transformed);
    };
    fetchMoodLogs();
  }, []);

  const valueToLabel = {
    1: "Sad",
    2: "Ennui",
    3: "Anxiety",
    4: "Disgust",
    5: "Angry",
    6: "Happy",
  };

  const EmojiShape = ({ cx, cy, payload }) => {
    const emojiMap = {
      1: "😢", // Sad
      2: "😐", // Ennui
      3: "😰", // Anxiety
      4: "🤢", // Disgust
      5: "😠", // Angry
      6: "😊", // Happy
    };

    return (
      <text
        x={cx}
        y={cy}
        fontSize="22px"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {emojiMap[payload.moodValue]}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood History</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="timestamp"
            domain={["auto", "auto"]}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            stroke="#ccc"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="hour"
            domain={[0, 24]}
            tickFormatter={(val) => `${Math.floor(val)}:00`}
            stroke="#ccc"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "hour") {
                const hours = Math.floor(value);
                const minutes = Math.round((value - hours) * 60);
                return `${hours}:${minutes.toString().padStart(2, "0")}`;
              }
              return value;
            }}
            labelFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleDateString();
            }}
          />
          <Scatter data={moodLogs} shape={<EmojiShape />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

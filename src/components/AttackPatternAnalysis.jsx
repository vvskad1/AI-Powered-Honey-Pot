import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AttackPatternAnalysis() {
  const [attackData, setAttackData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/analyze_attacks")
      .then((res) => res.json())
      .then((data) => {
        setAttackData(data.attack_distribution);
      })
      .catch((err) => console.error("❌ Error fetching attack analysis:", err));
  }, []);

  return (
    <Card sx={{ p: 2, backgroundColor: "#f6f6f6", boxShadow: 3, marginTop: 5 }}>
      <CardHeader title={<Typography variant="h5">Attack Pattern Analysis</Typography>} />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attackData}>
            <XAxis dataKey="attack_type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FF5733" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

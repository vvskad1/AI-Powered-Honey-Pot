import { useState } from "react";
import { Card, CardContent, CardHeader, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AttackStatistics({ attackData }) {
  const [chartType, setChartType] = useState("bar");

  return (
    <Card sx={{ p: 2, backgroundColor: "#f6f6f6", boxShadow: 3 }}>
      <CardHeader
        title="Attack Statistics"
        action={
          <ToggleButtonGroup value={chartType} exclusive onChange={(event, newType) => setChartType(newType)}>
            <ToggleButton value="bar">Bar Chart</ToggleButton>
            <ToggleButton value="pie">Pie Chart</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart data={attackData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={attackData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {attackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

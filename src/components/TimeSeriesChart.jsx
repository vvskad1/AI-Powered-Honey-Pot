import { Card, CardContent, CardHeader } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TimeSeriesChart({ timeSeriesData }) {
  return (
    <Card sx={{ p: 2, backgroundColor: "#f6f6f6", boxShadow: 3 }}>
      <CardHeader title="Attack Frequency Over Time" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <XAxis dataKey="hour" domain={[0, 23]} tickFormatter={(tick) => `${tick}:00`} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="SQL" stroke="#0000FF" name="SQL Injection" />
            <Line type="monotone" dataKey="XSS" stroke="#800080" name="XSS Attack" />
            <Line type="monotone" dataKey="RCE" stroke="#FF0000" name="Remote Code Execution" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

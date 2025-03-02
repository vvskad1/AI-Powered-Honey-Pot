import { useState, useEffect } from "react"; 
import { Container, Grid, Card, CardContent, CardHeader, CardActions, Button, Typography, CircularProgress } from "@mui/material";
import AttackStatistics from "./AttackStatistics";
import TimeSeriesChart from "./TimeSeriesChart";
import LiveLogs from "./LiveLogs";

export default function HoneypotDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
    setupWebSocket();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8000/logs");
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs([...data]);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const setupWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8000/ws/logs");
  
    socket.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        console.log("🔥 New Log Received:", newLog);
        setLogs((prevLogs) => [newLog, ...prevLogs]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  
    socket.onclose = () => {
      console.warn("WebSocket disconnected. Reconnecting in 3 seconds...");
      setTimeout(setupWebSocket, 3000); // Auto-reconnect after disconnect
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  };
  
  
  const triggerAttack = async (type) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();
      console.log("Attack Response:", data); // Debugging log

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error triggering attack:", error);
    }
    setLoading(false);
  };

  const attackCounts = logs.reduce((acc, log) => {
    acc[log.attack_type] = (acc[log.attack_type] || 0) + 1;
    return acc;
  }, {});

  const attackData = Object.keys(attackCounts).map((key) => ({
    name: key,
    count: attackCounts[key],
    color: key === "SQL Injection" ? "#0000FF" : key === "XSS" ? "#800080" : "#FF0000"
  }));

  const timeSeriesData = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).getHours();
    if (!acc[hour]) acc[hour] = { hour, SQL: 0, XSS: 0, RCE: 0 };
    acc[hour][log.attack_type]++;
    return acc;
  }, {});
  const formattedTimeSeriesData = Object.values(timeSeriesData);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "left", justifyContent: "left", minHeight: "100vh", width: "100vw" }}>
      <Typography fontWeight="bold" variant="h2" gutterBottom>Dashboard</Typography>

      <Card sx={{ width: "100%", maxWidth: 1000, mb: 4, p: 2, textAlign: "left", backgroundColor: "#f6f6f6", boxShadow: 3 }}>
        <h2 textAlign="left">Simulate Attacks</h2>
        <CardActions sx={{ justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" color="primary" onClick={() => triggerAttack("SQL Injection")} disabled={loading}>Simulate SQL Injection</Button>
          <Button variant="contained" color="secondary" onClick={() => triggerAttack("XSS")} disabled={loading}>Simulate XSS Attack</Button>
          <Button variant="contained" color="error" onClick={() => triggerAttack("RCE")} disabled={loading}>Simulate Remote Code Execution</Button>
        </CardActions>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><AttackStatistics attackData={attackData} /></Grid>
        <Grid item xs={12} md={6}><TimeSeriesChart timeSeriesData={formattedTimeSeriesData} /></Grid>
      </Grid>

      <LiveLogs logs={logs} />
    </Container>
  );
}

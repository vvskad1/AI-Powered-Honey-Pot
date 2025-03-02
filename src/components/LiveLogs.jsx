import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function LiveLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/logs");

    socket.onopen = () => {
      console.log("✅ WebSocket Connected to /ws/logs");
    };

    socket.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        if (newLog.attack_type) {
          setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 10)); // Keep only last 10 logs
          console.log("📩 New Log Received:", newLog);
        } else {
          console.warn("⚠️ WebSocket received an invalid log:", newLog);
        }
      } catch (error) {
        console.error("❌ WebSocket Parsing Error:", error);
      }
    };
    
    

    socket.onclose = () => {
      console.warn("⚠️ WebSocket Disconnected. Reconnecting in 3 seconds...");
      setTimeout(setupWebSocket, 3000);
    };    

    return () => socket.close();
  }, []);

  return (
    <Card sx={{ p: 2, backgroundColor: "#f6f6f6", boxShadow: 3, marginTop: 10, width: "80%" }}>
      <CardHeader title={
        <Typography variant="h3" sx={{ display: "flex", alignItems: "center" }}>
          <span style={{
            width: 24, height: 24, backgroundColor: "red",
            borderRadius: "50%", display: "inline-block", marginRight: 8
          }}></span>
          Live Logs
        </Typography>
      }/>
      <CardContent>
        <List>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${log.attack_type || "Unknown Attack"}: ${log.response || "No response"}`}
                  secondary={`Time: ${log.timestamp ? new Date(log.timestamp).toLocaleString() : "Unknown Time"}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">No logs available.</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

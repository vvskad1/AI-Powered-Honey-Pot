from locust import HttpUser, task, between

class HoneypotUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def attack_sql(self):
        self.client.post("/attack", json={"type": "SQL Injection"})

    @task
    def attack_xss(self):
        self.client.post("/attack", json={"type": "XSS"})

    @task
    def attack_rce(self):
        self.client.post("/attack", json={"type": "RCE"})

    @task
    def view_logs(self):
        self.client.get("/logs")

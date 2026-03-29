# Thread Benchmark Local Run Guide

## Stack
- Frontend: `http://localhost:3000`
- Platform backend: `http://localhost:8080`
- Virtual backend: `http://localhost:8081`
- Prometheus: `http://localhost:19090`
- Grafana: `http://localhost:13000`
- WireMock: `http://localhost:18089`

## One-command startup
```powershell
.\scripts\up.ps1
```

This starts:
- MySQL
- Redis
- WireMock
- `backend-platform`
- `backend-virtual`
- Frontend
- Prometheus
- Grafana

## Shutdown
```powershell
.\scripts\down.ps1
```

## Reset data and rebuild
```powershell
.\scripts\reset-data.ps1
```

## GUI usage
1. Open `http://localhost:3000`
2. Use the preset target buttons to switch between `Platform` and `Virtual`
3. Create a benchmark run from the dashboard
4. Review run detail, layer metrics, bottleneck notes, and runtime snapshots
5. Pick a second run in the comparison panel to compare throughput, p95/p99, and error rate
6. Open the embedded or full Grafana dashboard for time-series inspection

## Grafana
- URL: `http://localhost:13000`
- Login: `admin / admin`
- Anonymous viewer access is enabled for the embedded dashboard panel
- Provisioned dashboard: `Thread Benchmark Overview`

## Notes
- Benchmark runs are executed by JMeter inside each backend container.
- Run artifacts are written inside the backend containers under `/app/results`.
- External API behavior is simulated through WireMock and configured per benchmark run.
- Layer metrics, run config, snapshots, summary text, and bottleneck notes are persisted in MySQL.
- If you run the backend outside Docker, install JMeter and ensure `jmeter` is available on `PATH`.

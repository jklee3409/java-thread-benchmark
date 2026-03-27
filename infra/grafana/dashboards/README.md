이 폴더에는 이후 Grafana dashboard JSON을 넣습니다.

권장 패널:
- RPS
- http.server.requests p95
- benchmark.db.read p95
- benchmark.redis.get p95
- benchmark.external.call p95
- jdbc.connections.active
- hikaricp.connections.pending
- jvm.threads.live
- jvm.threads.virtual.live (micrometer-java21 사용 시)

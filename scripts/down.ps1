$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\infra
docker compose down
Write-Host "Infra is down."

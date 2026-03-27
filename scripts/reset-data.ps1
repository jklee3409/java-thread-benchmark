$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\infra
docker compose down -v
docker compose up -d
Write-Host "Infra volumes recreated."

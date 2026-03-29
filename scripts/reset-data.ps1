$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\infra
docker compose down -v
docker compose up -d --build
Write-Host "Infra volumes recreated."

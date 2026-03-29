$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\infra
docker compose up -d --build
Write-Host "Infra is up."

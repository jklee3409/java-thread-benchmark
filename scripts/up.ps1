$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\infra
docker compose up -d
Write-Host "Infra is up."

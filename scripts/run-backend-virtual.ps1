$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local-docker,virtual"

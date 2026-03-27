$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\backend
mvn spring-boot:run "-Dspring-boot.run.profiles=local-docker,platform"

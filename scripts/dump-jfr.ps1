param(
  [Parameter(Mandatory=$true)][string]$Pid,
  [string]$Name = "threadbench",
  [string]$Filename = "threadbench-final.jfr"
)

jcmd $Pid JFR.dump name=$Name filename=$Filename

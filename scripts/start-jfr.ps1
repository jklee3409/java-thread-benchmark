param(
  [Parameter(Mandatory=$true)][string]$Pid,
  [string]$Name = "threadbench",
  [string]$Filename = "threadbench.jfr"
)

jcmd $Pid JFR.start name=$Name settings=profile filename=$Filename

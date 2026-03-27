param(
  [Parameter(Mandatory=$true)][string]$Pid,
  [Parameter(Mandatory=$true)][string]$OutputFile
)

jcmd $Pid Thread.dump_to_file -format=json $OutputFile

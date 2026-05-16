$ErrorActionPreference = "Stop"
$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RootDir
$Mode = if ($args.Count -gt 0) { $args[0] } else { "start" }

function Show-Usage {
  @"
usage: powershell -ExecutionPolicy Bypass -File ./script/build_and_run.ps1 [mode]

Modes:
  start, run          Start the Expo dev server
  --ios, ios          Start Expo and open iOS
  --android, android  Start Expo and open Android
  --web, web          Start Expo for web
  --dev-client        Start Expo in development-client mode
  --tunnel            Start Expo using tunnel transport
  --doctor, doctor    Run Expo diagnostics
  --help, help        Show this help
"@
}

function Invoke-Expo {
  param([string[]]$ExpoArgs)

  & npx.cmd expo @ExpoArgs
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

switch ($Mode) {
  { $_ -in @("start", "run") } { Invoke-Expo @("start"); break }
  { $_ -in @("--ios", "ios") } { Invoke-Expo @("start", "--ios"); break }
  { $_ -in @("--android", "android") } { Invoke-Expo @("start", "--android"); break }
  { $_ -in @("--web", "web") } { Invoke-Expo @("start", "--web"); break }
  { $_ -in @("--dev-client", "dev-client") } { Invoke-Expo @("start", "--dev-client"); break }
  { $_ -in @("--tunnel", "tunnel") } { Invoke-Expo @("start", "--tunnel"); break }
  { $_ -in @("--doctor", "doctor") } { & npx.cmd expo-doctor; exit $LASTEXITCODE }
  { $_ -in @("--help", "help") } { Show-Usage; break }
  default {
    Show-Usage
    exit 2
  }
}

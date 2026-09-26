param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token)
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces" -Headers @{ Authorization = "Bearer $Token" } -Method Post -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 10

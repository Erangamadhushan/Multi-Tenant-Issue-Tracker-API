param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token)
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces" -Headers @{ Authorization = "Bearer $Token" } -Method Get
$response | ConvertTo-Json -Depth 10

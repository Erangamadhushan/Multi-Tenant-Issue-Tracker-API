param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token, [Parameter(Mandatory)] [string]$WorkspaceId)
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces/$WorkspaceId/projects" -Headers @{ Authorization = "Bearer $Token" } -Method Post -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 10

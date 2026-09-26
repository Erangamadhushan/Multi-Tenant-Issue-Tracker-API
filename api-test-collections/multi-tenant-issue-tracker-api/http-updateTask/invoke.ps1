param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token, [Parameter(Mandatory)] [string]$WorkspaceId, [Parameter(Mandatory)] [string]$ProjectId, [Parameter(Mandatory)] [string]$TaskId)
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces/$WorkspaceId/projects/$ProjectId/tasks/$TaskId" -Headers @{ Authorization = "Bearer $Token" } -Method Patch -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 10

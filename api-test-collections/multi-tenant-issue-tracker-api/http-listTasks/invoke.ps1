param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token, [Parameter(Mandatory)] [string]$WorkspaceId, [Parameter(Mandatory)] [string]$ProjectId)
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces/$WorkspaceId/projects/$ProjectId/tasks" -Headers @{ Authorization = "Bearer $Token" } -Method Get
$response | ConvertTo-Json -Depth 10

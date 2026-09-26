param([string]$BaseUrl = 'http://localhost:3000', [Parameter(Mandatory)] [string]$Token, [Parameter(Mandatory)] [string]$WorkspaceId)
$response = Invoke-RestMethod -Uri "$BaseUrl/api/workspaces/$WorkspaceId/projects" -Headers @{ Authorization = "Bearer $Token" } -Method Get
$response | ConvertTo-Json -Depth 10

param([string]$BaseUrl = 'http://localhost:3000')
$ErrorActionPreference = 'Stop'

function Invoke-CollectionScript([string]$Name, [hashtable]$Arguments = @{}) {
  $path = Join-Path $PSScriptRoot "$Name/invoke.ps1"
  $output = & pwsh -NoProfile -ExecutionPolicy Bypass -File $path @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Smoke test failed: $Name" }
  return ($output -join "`n") | ConvertFrom-Json
}

Write-Host 'GET /api/health'
Invoke-CollectionScript 'http-health' @{ BaseUrl = $BaseUrl } | Out-Null

Write-Host 'POST /api/auth/register'
$registerEmail = "smoke-$([DateTime]::UtcNow.ToString('yyyyMMddHHmmssfff'))@example.com"
$registerPath = Join-Path $PSScriptRoot 'http-register/sample-data.json'
$registerBody = @{ email = $registerEmail; password = 'password123'; name = 'Smoke User' } | ConvertTo-Json
Set-Content -Path $registerPath -Value $registerBody
Invoke-CollectionScript 'http-register' @{ BaseUrl = $BaseUrl } | Out-Null

Write-Host 'POST /api/auth/login'
$loginPath = Join-Path $PSScriptRoot 'http-login/sample-data.json'
Set-Content -Path $loginPath -Value (@{ email = $registerEmail; password = 'password123' } | ConvertTo-Json)
$login = Invoke-CollectionScript 'http-login' @{ BaseUrl = $BaseUrl }
$token = $login.data.token

Write-Host 'GET /api/workspaces'
Invoke-CollectionScript 'http-listWorkspaces' @{ BaseUrl = $BaseUrl; Token = $token } | Out-Null

Write-Host 'POST /api/workspaces'
$workspace = Invoke-CollectionScript 'http-createWorkspace' @{ BaseUrl = $BaseUrl; Token = $token }
$workspaceId = $workspace.data.workspace.id

Write-Host 'GET /api/workspaces/:workspaceId/projects'
Invoke-CollectionScript 'http-listProjects' @{ BaseUrl = $BaseUrl; Token = $token; WorkspaceId = $workspaceId } | Out-Null

Write-Host 'POST /api/workspaces/:workspaceId/projects'
$project = Invoke-CollectionScript 'http-createProject' @{ BaseUrl = $BaseUrl; Token = $token; WorkspaceId = $workspaceId }
$projectId = $project.data.project.id

Write-Host 'GET /api/workspaces/:workspaceId/projects/:projectId/tasks'
Invoke-CollectionScript 'http-listTasks' @{ BaseUrl = $BaseUrl; Token = $token; WorkspaceId = $workspaceId; ProjectId = $projectId } | Out-Null

Write-Host 'POST /api/workspaces/:workspaceId/projects/:projectId/tasks'
$task = Invoke-CollectionScript 'http-createTask' @{ BaseUrl = $BaseUrl; Token = $token; WorkspaceId = $workspaceId; ProjectId = $projectId }
$taskId = $task.data.task.id

Write-Host 'PATCH /api/workspaces/:workspaceId/projects/:projectId/tasks/:taskId'
Invoke-CollectionScript 'http-updateTask' @{ BaseUrl = $BaseUrl; Token = $token; WorkspaceId = $workspaceId; ProjectId = $projectId; TaskId = $taskId } | Out-Null

Write-Host 'API smoke collection passed: 10 endpoints'

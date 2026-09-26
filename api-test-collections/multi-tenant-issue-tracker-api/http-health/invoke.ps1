param([string]$BaseUrl = 'http://localhost:3000')
$response = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method Get
$response | ConvertTo-Json -Depth 10

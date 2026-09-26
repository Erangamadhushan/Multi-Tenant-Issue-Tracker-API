param([string]$BaseUrl = 'http://localhost:3000')
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
$response = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 10

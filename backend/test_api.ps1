$php = "C:\Users\longx\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.WinGet.Source_8wekyb3d8bbwe\php.exe"
Get-Process -Name "php" -ErrorAction SilentlyContinue | Stop-Process -Force
& $php artisan optimize:clear
& $php artisan migrate:fresh --seed
$server = Start-Process -FilePath $php -ArgumentList "artisan", "serve", "--host=127.0.0.1", "--port=8003" -PassThru
Start-Sleep -Seconds 5

try {
    $citAuth = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/auth/login" -Method Post -Body (@{email="citizen@ecocollect.vn"; password="citizen123"} | ConvertTo-Json) -ContentType "application/json"
    $citToken = if ($citAuth.token) { $citAuth.token } else { $citAuth.access_token }
    Write-Host "3. Citizen Login: Success"
    
    $repData = @{category_id=1; title="Waste"; description="D1"; latitude=10.7; longitude=106.6; address="A"; waste_type_id=1; image_urls=@("http://i.com/1.jpg")}
    $repResp = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/citizen/reports" -Method Post -Headers @{Authorization="Bearer $citToken"} -Body ($repData | ConvertTo-Json) -ContentType "application/json"
    $rid = if ($repResp.data.id) { $repResp.data.id } else { $repResp.report.id }
    Write-Host "4. Create Report: Success (ID: $rid)"
    
    $entAuth = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/auth/login" -Method Post -Body (@{email="enterprise@ecocollect.vn"; password="enterprise123"} | ConvertTo-Json) -ContentType "application/json"
    $entToken = if ($entAuth.token) { $entAuth.token } else { $entAuth.access_token }
    Write-Host "5. Enterprise Login: Success"
    
    $colls = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/enterprise/collectors" -Method Get -Headers @{Authorization="Bearer $entToken"}
    $cid = $colls.data[0].id
    Write-Host "6. Get Collector: Success (ID: $cid)"
    
    Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/enterprise/reports/$rid/accept" -Method Post -Headers @{Authorization="Bearer $entToken"}
    $assResp = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/enterprise/reports/$rid/assign" -Method Post -Headers @{Authorization="Bearer $entToken"} -Body (@{collector_id=$cid} | ConvertTo-Json) -ContentType "application/json"
    $aid = $assResp.data.id
    Write-Host "7. Accept & Assign: Success (AID: $aid)"
    
    $colAuth = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/auth/login" -Method Post -Body (@{email="collector@ecocollect.vn"; password="collector123"} | ConvertTo-Json) -ContentType "application/json"
    $colToken = if ($colAuth.token) { $colAuth.token } else { $colAuth.access_token }
    Write-Host "8. Collector Login: Success"
    
    Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/collector/tasks/$aid/start" -Method Post -Headers @{Authorization="Bearer $colToken"}
    Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/collector/tasks/$aid/collect" -Method Post -Headers @{Authorization="Bearer $colToken"} -Body (@{proof_image_url="http://i.com/p.jpg"; weight=10} | ConvertTo-Json) -ContentType "application/json"
    Write-Host "9. Start & Collect: Success"
    
    $fin = Invoke-RestMethod -Uri "http://127.0.0.1:8003/api/citizen/reports/$rid/confirm" -Method Post -Headers @{Authorization="Bearer $citToken"}
    Write-Host "10. Citizen Confirm: Success ($($fin.message))"
} catch {
    Write-Host "ERROR at Step: " $_.Exception.Message
    if ($_.Exception.Response) {
       $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
       Write-Host $reader.ReadToEnd()
    }
} finally {
    if ($server) { Stop-Process -Id $server.Id -Force }
    Get-Process -Name "php" -ErrorAction SilentlyContinue | Stop-Process -Force
}

Write-Host "Auto Git Push started..."

while ($true) {
    Write-Host "Checking for changes at $(Get-Date -Format 'HH:mm:ss')"

    $changes = git status --porcelain

    if ($changes) {
        git add .
        git commit -m "Auto update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push
        Write-Host "Changes pushed at $(Get-Date)"
    }
    else {
        Write-Host "No changes found."
    }

    Start-Sleep -Seconds 30
}
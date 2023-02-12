#* Install dependencies for the script *#

Set-Location .\script && pnpm install
pnpm build

# Copy .env.example to .env
Copy-Item -Path .\.env.example -Destination .\.env

#* Generate start script *#

$script = @'
node --no-warnings .\script\cli.js
'@

# Write the script to a file
try {
    Set-Location ..\
    $script | Out-File -FilePath start.ps1 -Encoding UTF8
}
catch {
    Write-Error $_.ErrorRecord.Exception.Message
}

#* Clean up *#

# Delete the script file
# Set-Location ..\
# Remove-Item -Path .\install.ps1 -Force
# Remove-Item -Path .\LICENSE -Force

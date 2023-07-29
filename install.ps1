# Ensure the script stops on any errors
$ErrorActionPreference = "Stop"

#* Install dependencies for the script *#

# Display a message to indicate the start of the installation process
Write-Host "Starting installation process..." -ForegroundColor Green

#* Install dependencies for the script *#
try {
    Write-Host "Installing dependencies..."
    pnpm install 2>&1 | Out-Null
}
catch {
    Write-Error "Failed to install dependencies. Error: $($_.Exception.Message)"
    exit 1
}

#* Build the project *#
try {
    Write-Host "Building the project..."
    $buildOutput = pnpm build 2>&1

    # Check if pnpm build was successful
    if ($LASTEXITCODE -ne 0) {
        # Convert the captured output to a single string and display it
        $errorMessage = $buildOutput -join "`n"
        Write-Error $errorMessage
        exit 1
    }
}
catch {
    Write-Error "Failed to build the project. Error: $($_.Exception.Message)"
    exit 1
}

#* Copy .env.example to .env if .env doesn't exist *#
if (-not (Test-Path .\.env)) {
    try {
        Copy-Item -Path .\.env.example -Destination .\.env
        Write-Host ".env file created successfully."
    }
    catch {
        Write-Error "Failed to copy .env.example to .env. Error: $($_.Exception.Message)"
        exit 1
    }
}
else {
    Write-Host ".env file already exists. Skipping copy."
}

#* Generate start script *#
$script = @'
node --no-warnings .\Script\dist\cli.js

# Wait for user input before closing the window
Read-Host -Prompt "Press Enter to exit"
'@

# Write the script to a file
try {
    $script | Out-File -FilePath ../start.ps1 -Encoding UTF8
    Write-Host "start.ps1 script generated successfully."
}
catch {
    Write-Error "Failed to generate start.ps1 script. Error: $($_.Exception.Message)"
    exit 1
}

#* Clean up *#

# Delete the script file
# Set-Location ..\
# Remove-Item -Path .\install.ps1 -Force
# Remove-Item -Path .\LICENSE -Force

# Display a message to indicate the end of the installation process
Write-Host "Installation process completed successfully." -ForegroundColor Green
# PowerShell script to update import paths after component restructuring

# Define the replacements
$replacements = @{
    "@/src/components/ui/buttons/" = "@/src/components/buttons/"
    "@/src/components/ui/" = "@/src/components/common/"
}

# Get all TypeScript and JavaScript files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts", "*.js", "*.jsx"

Write-Host "Found $($files.Count) files to process..."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Apply each replacement
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Import path updates complete!"

# PowerShell script to run SQL in Supabase
# Make sure you have your .env.local file with Supabase credentials

Write-Host "🚀 Supabase SQL Runner" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local with your Supabase credentials:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" -ForegroundColor Cyan
    Write-Host "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ .env.local found" -ForegroundColor Green

# Read the SQL file
$sqlPath = "database\chat_schema.sql"
if (-not (Test-Path $sqlPath)) {
    Write-Host "❌ SQL file not found at: $sqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ SQL file found: $sqlPath" -ForegroundColor Green

# Read SQL content
$sqlContent = Get-Content $sqlPath -Raw
Write-Host "📝 SQL content loaded (${sqlContent.Length} characters)" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Supabase Dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Click 'New Query'" -ForegroundColor White
Write-Host "4. Copy and paste the SQL content below:" -ForegroundColor White
Write-Host "5. Click 'Run'" -ForegroundColor White

Write-Host ""
Write-Host "📋 SQL Content to Copy:" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host $sqlContent -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 Alternative: Use the Supabase Dashboard directly" -ForegroundColor Green
Write-Host "1. Open: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Go to SQL Editor" -ForegroundColor White
Write-Host "4. Copy the SQL above and run it" -ForegroundColor White

Write-Host ""
Write-Host "✅ After running the SQL, your chat system will be ready!" -ForegroundColor Green

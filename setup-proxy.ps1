# Скрипт для запуска dev сервера с прокси
$env:HTTP_PROXY = "http://10.80.96.148:9100"
$env:HTTPS_PROXY = "http://10.80.96.148:9100"
$env:NO_PROXY = "localhost,127.0.0.1"

Write-Host "Прокси настроен:" -ForegroundColor Green
Write-Host "HTTP_PROXY = $env:HTTP_PROXY"
Write-Host "HTTPS_PROXY = $env:HTTPS_PROXY"
Write-Host ""
Write-Host "Запускаю dev сервер..." -ForegroundColor Yellow
npm run dev


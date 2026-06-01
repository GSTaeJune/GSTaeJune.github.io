@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ============================================
echo   홈페이지 미리보기를 시작합니다
echo  ============================================
echo.
echo   잠시 후 브라우저가 자동으로 열립니다.
echo   (안 열리면 직접 접속:  http://localhost:8000  )
echo.
echo   ※ 다 보고 나면 이 검은 창을 닫으면 종료됩니다.
echo.
start "" "http://localhost:8000/index.html"
python -m http.server 8000 || py -m http.server 8000

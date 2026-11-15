@echo off
rem Abre o site Dentalis no navegador (precisa do Python instalado).
cd /d "%~dp0"
start "" http://localhost:8622
python -m http.server 8622

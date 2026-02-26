@echo off
setlocal
set "ROOT=%~dp0"
set "GIT_HOME=%ROOT%..\tools\mingit\cmd"
set "NODE_HOME=%ROOT%..\tools\node\node-v22.17.0-win-x64"
set "PATH=%GIT_HOME%;%NODE_HOME%;%PATH%"
echo Local toolchain enabled:
echo   git:  %GIT_HOME%
echo   node: %NODE_HOME%
echo.
cmd /k "cd /d %ROOT%"

@echo off
setlocal enabledelayedexpansion

if "%~1"=="" (
    echo drop webms on to the bat file
    pause
    exit
)

set "OUTDIR=D:\Workspace\stashtag\encode"

:loop
if "%~1"=="" goto end

set "in=%~1"
for %%F in ("%~1") do set "name=%%~nF"
set "out=%OUTDIR%\%name%.webm"

echo Encoding: "%in%"
echo Output: "%out%"

ffmpeg -hide_banner -y ^
-i "%in%" ^
-c:v libvpx-vp9 ^
-b:v 0 ^
-crf 34 ^
-speed 0 ^
-row-mt 1 ^
-tile-columns 2 ^
-frame-parallel 1 ^
-auto-alt-ref 1 ^
-lag-in-frames 25 ^
-threads 8 ^
-c:a copy ^
"%out%"

shift
goto loop

:end
pause
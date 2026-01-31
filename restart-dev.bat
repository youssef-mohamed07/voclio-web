@echo off
echo Clearing Next.js cache and restarting dev server...
echo.

echo Step 1: Removing .next cache folder...
if exist .next (
    rmdir /s /q .next
    echo .next folder removed
) else (
    echo .next folder not found
)
echo.

echo Step 2: Starting dev server...
echo.
npm run dev

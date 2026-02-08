@echo off
REM everything-antigravity Windows Setup Script
REM This script initializes the environment for all skills and core components.

echo 🚀 Starting everything-antigravity setup...

REM 1. Environment Check
echo 🔍 Checking runtimes...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18+) to continue.
    exit /b 1
)

where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9+ to continue.
    exit /b 1
)

echo ✅ Runtimes OK: Node.js and Python found.

REM 2. Setup Environment Variables
echo 🔑 Setting up environment variables...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env from .env.example. Please update your API keys in .env
    ) else (
        echo. > .env
        echo ⚠️ .env.example not found, created empty .env
    )
) else (
    echo ℹ️ .env already exists, skipping creation.
)

REM 3. Setup Node.js Skills
echo 🔧 Setting up Node.js Skills...

REM Vision Skill
if exist ".agent\skills\capabilities\vision\package.json" (
    echo 📦 Installing: capabilities/vision
    pushd .agent\skills\capabilities\vision
    call npm install
    call npm run build --if-present
    popd
)

REM Browsing Skill
if exist ".agent\skills\capabilities\browsing\package.json" (
    echo 📦 Installing: capabilities/browsing
    pushd .agent\skills\capabilities\browsing
    call npm install
    call npm run build --if-present
    popd
)

REM Dispatcher Skill (with tsconfig fix)
if exist ".agent\skills\core\dispatcher\package.json" (
    echo 📦 Installing: core/dispatcher
    pushd .agent\skills\core\dispatcher
    
    REM Create tsconfig.json if missing
    if not exist "tsconfig.json" (
        echo ⚠️ Creating missing tsconfig.json for dispatcher...
        (
            echo {
            echo   "compilerOptions": {
            echo     "target": "ES2022",
            echo     "module": "NodeNext",
            echo     "moduleResolution": "NodeNext",
            echo     "outDir": "./dist",
            echo     "rootDir": "./src",
            echo     "strict": true,
            echo     "esModuleInterop": true,
            echo     "skipLibCheck": true,
            echo     "forceConsistentCasingInFileNames": true
            echo   },
            echo   "include": ["src/**/*"],
            echo   "exclude": ["node_modules", "**/*.test.ts"]
            echo }
        ) > tsconfig.json
    )
    
    call npm install
    call npm run build --if-present
    popd
)

REM 4. Setup Python Skills
echo 🐍 Setting up Python Skills...

REM Korean Law Skill
if exist ".agent\skills\knowledge\korean-law\requirements.txt" (
    echo 🐍 Installing: knowledge/korean-law
    pushd .agent\skills\knowledge\korean-law
    if not exist ".venv" (
        python -m venv .venv
    )
    call .venv\Scripts\pip install --upgrade pip
    call .venv\Scripts\pip install -r requirements.txt
    popd
)

echo.
echo ✅ Setup complete! You are ready to go with everything-antigravity.
echo.
echo 📝 Next steps:
echo    1. Update .env with your API keys
echo    2. If using MCP, copy mcp\mcp_servers.sample.json to your client config

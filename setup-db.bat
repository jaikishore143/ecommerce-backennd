@echo off
echo Setting up the database for Cricket Glow Express...

REM Generate Prisma client
echo Generating Prisma client...
npx prisma generate

REM Create database and run migrations
echo Running database migrations...
npx prisma migrate dev --name init

REM Seed the database with initial data
echo Seeding the database...
npx prisma db seed

echo Database setup complete!
echo You can now start the server with 'npm run dev'
pause

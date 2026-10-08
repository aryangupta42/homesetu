@echo off
title HomeSetu - Spring Boot Backend
echo ========================================================
echo   HomeSetu Backend - Spring Boot 3 (Java 17)
echo ========================================================
cd backend
if not defined JAVA_HOME (
    set JAVA_HOME=C:\Program Files\Java\jdk-17
)
mvn spring-boot:run
pause

@echo off
echo Setting JAVA_HOME to local portable JDK...
set "JAVA_HOME=%~dp0..\jdk17\jdk-17.0.20+8"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Running Spring Boot...
cd "%~dp0"
mvnw clean compile spring-boot:run
pause

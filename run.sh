#!/bin/bash
# Load environment variables and start Spring Boot
set -a
source .env
set +a
mvn spring-boot:run

# Stage 1: compilar con Maven
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Cachear dependencias antes de copiar el código fuente
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2: imagen de ejecución mínima
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Variables de entorno - configurar como Config Vars en Railway
ENV DB_URL=""
ENV DB_USER=""
ENV DB_PASSWORD=""
ENV JWT_SECRET=""
ENV JWT_EXPIRATION=86400000
ENV CORS_ORIGINS=""
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]

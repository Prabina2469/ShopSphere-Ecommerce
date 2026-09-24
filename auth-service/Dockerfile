# Build this service's jar first with:
#   mvn -pl auth-service -am clean package -DskipTests
# then build the image from the repo root:
#   docker build -f auth-service/Dockerfile -t shopsphere/auth-service .
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY auth-service/target/auth-service-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build first with: mvn -pl product-service -am clean package -DskipTests
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY product-service/target/product-service-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]

# =========================
# Build Stage
# =========================
FROM maven:3.9.8-eclipse-temurin-17 AS builder

WORKDIR /build

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests


# =========================
# Runtime Stage
# =========================
FROM eclipse-temurin:17-jre

LABEL maintainer="retail-platform-devops"
LABEL application="product-service"

ENV TZ=Asia/Kolkata

ENV JAVA_OPTS="-XX:+UseContainerSupport \
-Xms256m \
-Xmx512m \
-XX:+ExitOnOutOfMemoryError \
-Duser.timezone=Asia/Kolkata"

RUN groupadd --system spring && useradd --system --gid spring spring

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

RUN chown spring:spring /app/app.jar

USER spring

EXPOSE 8083

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
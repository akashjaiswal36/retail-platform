# =========================
# Build Stage
# =========================
FROM maven:3.9.8-eclipse-temurin-17 AS builder

WORKDIR /build

# dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline

# source
COPY src ./src

# build
RUN mvn clean package -DskipTests


# =========================
# Runtime Stage
# =========================
FROM eclipse-temurin:17-jre

LABEL maintainer="retail-platform-devops"
LABEL application="auth-service"

# timezone
ENV TZ=Asia/Kolkata

# JVM container tuning
ENV JAVA_OPTS="-XX:+UseContainerSupport \
-Xms256m \
-Xmx512m \
-XX:+ExitOnOutOfMemoryError \
-Duser.timezone=Asia/Kolkata"

# non-root user
RUN groupadd --system spring && useradd --system --gid spring spring

WORKDIR /app

COPY --from=builder /build/target/auth-service-1.0.0.jar app.jar

RUN chown spring:spring /app/app.jar

USER spring

EXPOSE 8081

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
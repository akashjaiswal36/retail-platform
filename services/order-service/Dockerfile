# =========================
# Build Stage
# =========================
FROM maven:3.9.8-eclipse-temurin-17 AS builder

WORKDIR /build

# Dependency caching
COPY pom.xml .

RUN mvn dependency:go-offline

# Source
COPY src ./src

# Build
RUN mvn clean package -DskipTests


# =========================
# Runtime Stage
# =========================
FROM eclipse-temurin:17-jre

LABEL maintainer="retail-platform-devops"
LABEL application="order-service"

# OpenTelemetry Java Agent version
ARG OTEL_AGENT_VERSION=2.20.1

# Timezone
ENV TZ=Asia/Kolkata

# JVM container tuning + OpenTelemetry Java Agent
ENV JAVA_OPTS="-XX:+UseContainerSupport \
-Xms256m \
-Xmx512m \
-XX:+ExitOnOutOfMemoryError \
-Duser.timezone=Asia/Kolkata \
-javaagent:/app/opentelemetry-javaagent.jar"

# Non-root user
RUN groupadd --system spring && useradd --system --gid spring spring

WORKDIR /app

# Application
COPY --from=builder /build/target/*.jar app.jar

# OpenTelemetry Java Agent
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v${OTEL_AGENT_VERSION}/opentelemetry-javaagent.jar opentelemetry-javaagent.jar

# Give application user ownership
RUN chown spring:spring /app/app.jar /app/opentelemetry-javaagent.jar

USER spring

EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
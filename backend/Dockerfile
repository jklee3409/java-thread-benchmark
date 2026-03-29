FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /workspace

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN chmod +x gradlew
RUN sed -i 's/\r$//' gradlew
RUN ./gradlew --no-daemon dependencies

COPY src src

RUN ./gradlew --no-daemon bootJar

FROM eclipse-temurin:21-jre-jammy

ARG JMETER_VERSION=5.6.3

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates tar \
    && curl -fsSL "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz" -o /tmp/jmeter.tgz \
    && tar -xzf /tmp/jmeter.tgz -C /opt \
    && ln -s "/opt/apache-jmeter-${JMETER_VERSION}/bin/jmeter" /usr/local/bin/jmeter \
    && rm -rf /var/lib/apt/lists/* /tmp/jmeter.tgz

WORKDIR /app

COPY --from=builder /workspace/build/libs/*.jar /app/app.jar

EXPOSE 8080 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

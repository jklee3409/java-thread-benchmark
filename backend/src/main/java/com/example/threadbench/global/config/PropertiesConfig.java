package com.example.threadbench.global.config;

import com.example.threadbench.global.properties.AppProperties;
import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import com.example.threadbench.global.properties.ExternalApiProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({AppProperties.class, ExternalApiProperties.class, BenchmarkExecutionProperties.class})
public class PropertiesConfig {
}

package com.example.threadbench.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({AppProperties.class, ExternalApiProperties.class})
public class AppConfig {
}

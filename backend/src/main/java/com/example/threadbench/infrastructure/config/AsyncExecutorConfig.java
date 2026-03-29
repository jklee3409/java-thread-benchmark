package com.example.threadbench.infrastructure.config;

import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncExecutorConfig {

    @Bean(name = "benchmarkTaskExecutor")
    TaskExecutor benchmarkTaskExecutor(BenchmarkExecutionProperties properties) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("benchmark-runner-");
        executor.setCorePoolSize(properties.getExecutorThreads());
        executor.setMaxPoolSize(properties.getExecutorThreads());
        executor.setQueueCapacity(32);
        executor.initialize();
        return executor;
    }
}

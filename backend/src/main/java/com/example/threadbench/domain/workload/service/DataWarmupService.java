package com.example.threadbench.domain.workload.service;

import com.example.threadbench.domain.workload.entity.SampleItem;
import com.example.threadbench.domain.workload.repository.SampleItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataWarmupService {

    private static final String CACHE_HIT_NAMESPACE = "cachehit:item:";

    private final SampleItemRepository sampleItemRepository;
    private final StringRedisTemplate stringRedisTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void warmup() {
        List<SampleItem> items = sampleItemRepository.findAll();
        for (SampleItem item : items) {
            stringRedisTemplate.opsForValue().set(
                    CACHE_HIT_NAMESPACE + item.getId(),
                    item.getPayload(),
                    Duration.ofMinutes(10)
            );
        }
    }
}

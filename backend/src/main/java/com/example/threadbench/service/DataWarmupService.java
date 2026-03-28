package com.example.threadbench.service;

import com.example.threadbench.entity.SampleItem;
import com.example.threadbench.repository.SampleItemRepository;
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

    private final SampleItemRepository sampleItemRepository;
    private final StringRedisTemplate stringRedisTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void warmup() {
        List<SampleItem> items = sampleItemRepository.findAll();
        for (SampleItem item : items) {
            stringRedisTemplate.opsForValue().set("item:" + item.getId(), item.getPayload(), Duration.ofMinutes(10));
        }
    }
}

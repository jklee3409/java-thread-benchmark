package com.example.threadbench.domain.workload.repository;

import com.example.threadbench.domain.workload.entity.SampleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleItemRepository extends JpaRepository<SampleItem, Long> {
}

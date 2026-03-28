package com.example.threadbench.repository;

import com.example.threadbench.entity.SampleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleItemRepository extends JpaRepository<SampleItem, Long> {
}

package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.ExperimentRun;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperimentRunRepository extends JpaRepository<ExperimentRun, Long> {
}

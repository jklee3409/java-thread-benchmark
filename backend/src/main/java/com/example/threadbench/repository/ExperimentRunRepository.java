package com.example.threadbench.repository;

import com.example.threadbench.entity.ExperimentRun;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperimentRunRepository extends JpaRepository<ExperimentRun, Long> {
}

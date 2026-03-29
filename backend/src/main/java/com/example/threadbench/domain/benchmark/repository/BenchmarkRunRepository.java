package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenchmarkRunRepository extends JpaRepository<BenchmarkRun, Long> {

    List<BenchmarkRun> findAllByOrderByCreatedAtDesc();
}

package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.BenchmarkSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BenchmarkSummaryRepository extends JpaRepository<BenchmarkSummary, Long> {

    Optional<BenchmarkSummary> findByBenchmarkRun_Id(Long benchmarkRunId);
}

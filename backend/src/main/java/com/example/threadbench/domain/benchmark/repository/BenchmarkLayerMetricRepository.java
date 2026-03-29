package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenchmarkLayerMetricRepository extends JpaRepository<BenchmarkLayerMetric, Long> {

    List<BenchmarkLayerMetric> findByBenchmarkRun_IdOrderByLayerAsc(Long benchmarkRunId);

    void deleteByBenchmarkRun_Id(Long benchmarkRunId);
}

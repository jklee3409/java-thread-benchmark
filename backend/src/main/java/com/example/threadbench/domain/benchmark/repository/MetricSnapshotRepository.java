package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.MetricSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetricSnapshotRepository extends JpaRepository<MetricSnapshot, Long> {

    List<MetricSnapshot> findByBenchmarkRun_IdOrderByRecordedAtAsc(Long benchmarkRunId);
}

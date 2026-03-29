package com.example.threadbench.domain.benchmark.repository;

import com.example.threadbench.domain.benchmark.entity.BottleneckAnalysisNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BottleneckAnalysisNoteRepository extends JpaRepository<BottleneckAnalysisNote, Long> {

    List<BottleneckAnalysisNote> findByBenchmarkRun_IdOrderByCreatedAtAsc(Long benchmarkRunId);

    void deleteByBenchmarkRun_Id(Long benchmarkRunId);
}

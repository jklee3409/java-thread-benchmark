package com.example.threadbench.domain.workload.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sample_item")
@Getter
@Setter
@NoArgsConstructor
public class SampleItem {

    @Id
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    public SampleItem(Long id, String name, String payload) {
        this.id = id;
        this.name = name;
        this.payload = payload;
    }
}

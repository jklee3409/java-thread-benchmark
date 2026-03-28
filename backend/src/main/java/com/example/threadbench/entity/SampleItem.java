package com.example.threadbench.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sample_item")
public class SampleItem {

    @Id
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    public SampleItem() {
    }

    public SampleItem(Long id, String name, String payload) {
        this.id = id;
        this.name = name;
        this.payload = payload;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPayload() {
        return payload;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}

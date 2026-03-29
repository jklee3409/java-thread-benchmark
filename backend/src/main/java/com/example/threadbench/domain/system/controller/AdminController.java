package com.example.threadbench.domain.system.controller;

import com.example.threadbench.domain.system.dto.ModeResponse;
import com.example.threadbench.domain.system.service.ModeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ModeService modeService;

    @GetMapping("/mode")
    public ModeResponse mode() {
        return modeService.currentMode();
    }
}

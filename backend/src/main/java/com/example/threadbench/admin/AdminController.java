package com.example.threadbench.admin;

import com.example.threadbench.dto.ModeResponse;
import com.example.threadbench.service.ModeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ModeService modeService;

    public AdminController(ModeService modeService) {
        this.modeService = modeService;
    }

    @GetMapping("/mode")
    public ModeResponse mode() {
        return modeService.currentMode();
    }
}

package com.hrms.controller;

import com.hrms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/headcount")
    public ResponseEntity<Map<String, Object>> getHeadcount() {
        return ResponseEntity.ok(reportService.getHeadcount());
    }

    @GetMapping("/attendance-summary")
    public ResponseEntity<Map<String, Object>> getAttendanceSummary() {
        return ResponseEntity.ok(reportService.getAttendanceSummary());
    }

    @GetMapping("/payroll-summary")
    public ResponseEntity<Map<String, Object>> getPayrollSummary() {
        return ResponseEntity.ok(reportService.getPayrollSummary());
    }

    @GetMapping("/leave-summary")
    public ResponseEntity<Map<String, Object>> getLeaveSummary() {
        return ResponseEntity.ok(reportService.getLeaveSummary());
    }
}

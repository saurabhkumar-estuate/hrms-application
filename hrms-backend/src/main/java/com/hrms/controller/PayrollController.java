package com.hrms.controller;

import com.hrms.dto.PayrollDTO;
import com.hrms.model.Payroll;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate/{month}/{year}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    public ResponseEntity<List<Payroll>> generatePayroll(
            @PathVariable int month, @PathVariable int year) {
        return ResponseEntity.ok(payrollService.generatePayroll(month, year));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollByEmployee(employeeId));
    }

    @GetMapping("/all/{month}/{year}")
    public ResponseEntity<List<Payroll>> getAllPayroll(
            @PathVariable int month, @PathVariable int year) {
        return ResponseEntity.ok(payrollService.getAllPayrollByMonthYear(month, year));
    }

    @GetMapping("/payslip/{id}")
    public ResponseEntity<Payroll> getPayslip(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadPayslip(@PathVariable Long id) {
        byte[] pdf = payrollService.generatePayslipPdf(id);
        Payroll payroll = payrollService.getPayrollById(id);

        String filename = String.format("payslip_%s_%d_%d.pdf",
                payroll.getEmployee().getEmployeeCode(),
                payroll.getMonth(),
                payroll.getYear());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

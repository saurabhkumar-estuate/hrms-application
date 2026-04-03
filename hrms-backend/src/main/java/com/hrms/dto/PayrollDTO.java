package com.hrms.dto;

import com.hrms.model.PayrollStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String department;
    private Integer month;
    private Integer year;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal travelAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal performanceBonus;
    private BigDecimal grossSalary;
    private BigDecimal pf;
    private BigDecimal esi;
    private BigDecimal tds;
    private BigDecimal professionalTax;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private PayrollStatus status;
    private LocalDateTime processedAt;
}

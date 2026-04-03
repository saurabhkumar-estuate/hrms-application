package com.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "basic_salary")
    private BigDecimal basicSalary;

    private BigDecimal hra;

    @Column(name = "special_allowance")
    private BigDecimal specialAllowance;

    @Column(name = "travel_allowance")
    private BigDecimal travelAllowance;

    @Column(name = "medical_allowance")
    private BigDecimal medicalAllowance;

    @Column(name = "performance_bonus")
    private BigDecimal performanceBonus;

    @Column(name = "gross_salary")
    private BigDecimal grossSalary;

    private BigDecimal pf;

    private BigDecimal esi;

    private BigDecimal tds;

    @Column(name = "professional_tax")
    private BigDecimal professionalTax;

    @Column(name = "total_deductions")
    private BigDecimal totalDeductions;

    @Column(name = "net_salary")
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    private PayrollStatus status = PayrollStatus.PENDING;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}

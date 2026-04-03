package com.hrms.service;

import com.hrms.exception.ResourceNotFoundException;
import com.hrms.model.*;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.PayrollRepository;
import com.hrms.util.PayslipPdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final PayslipPdfGenerator payslipPdfGenerator;

    public List<Payroll> getAllPayrollByMonthYear(int month, int year) {
        return payrollRepository.findByMonthAndYear(month, year);
    }

    public List<Payroll> getPayrollByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found: " + id));
    }

    @Transactional
    public List<Payroll> generatePayroll(int month, int year) {
        List<Employee> employees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);

        for (Employee employee : employees) {
            payrollRepository.findByEmployeeIdAndMonthAndYear(employee.getId(), month, year)
                    .ifPresentOrElse(
                            existing -> {
                                // already exists, skip
                            },
                            () -> {
                                Payroll payroll = calculatePayroll(employee, month, year);
                                payrollRepository.save(payroll);
                            }
                    );
        }

        return payrollRepository.findByMonthAndYear(month, year);
    }

    private Payroll calculatePayroll(Employee employee, int month, int year) {
        BigDecimal grossSalary = employee.getSalary() != null ? employee.getSalary() : BigDecimal.ZERO;

        BigDecimal basicSalary = grossSalary.multiply(new BigDecimal("0.40")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal hra = grossSalary.multiply(new BigDecimal("0.20")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal specialAllowance = grossSalary.multiply(new BigDecimal("0.20")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal travelAllowance = new BigDecimal("1600.00");
        BigDecimal medicalAllowance = new BigDecimal("1250.00");
        BigDecimal performanceBonus = BigDecimal.ZERO;

        BigDecimal calculatedGross = basicSalary.add(hra).add(specialAllowance)
                .add(travelAllowance).add(medicalAllowance).add(performanceBonus);

        // Deductions
        BigDecimal pf = basicSalary.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal esi = grossSalary.compareTo(new BigDecimal("21000")) <= 0
                ? calculatedGross.multiply(new BigDecimal("0.0075")).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal tds = calculateTDS(grossSalary.multiply(BigDecimal.valueOf(12)));
        BigDecimal professionalTax = new BigDecimal("200.00");

        BigDecimal totalDeductions = pf.add(esi).add(tds).add(professionalTax);
        BigDecimal netSalary = calculatedGross.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);

        return Payroll.builder()
                .employee(employee)
                .month(month)
                .year(year)
                .basicSalary(basicSalary)
                .hra(hra)
                .specialAllowance(specialAllowance)
                .travelAllowance(travelAllowance)
                .medicalAllowance(medicalAllowance)
                .performanceBonus(performanceBonus)
                .grossSalary(calculatedGross)
                .pf(pf)
                .esi(esi)
                .tds(tds)
                .professionalTax(professionalTax)
                .totalDeductions(totalDeductions)
                .netSalary(netSalary)
                .status(PayrollStatus.PROCESSED)
                .processedAt(LocalDateTime.now())
                .build();
    }

    private BigDecimal calculateTDS(BigDecimal annualSalary) {
        // Simplified TDS calculation
        double annual = annualSalary.doubleValue();
        double tax = 0;
        if (annual > 1500000) {
            tax = (annual - 1500000) * 0.30 + 187500;
        } else if (annual > 1000000) {
            tax = (annual - 1000000) * 0.20 + 87500;
        } else if (annual > 750000) {
            tax = (annual - 750000) * 0.15 + 25000;
        } else if (annual > 500000) {
            tax = (annual - 500000) * 0.10;
        }
        return BigDecimal.valueOf(tax / 12).setScale(2, RoundingMode.HALF_UP);
    }

    public byte[] generatePayslipPdf(Long payrollId) {
        Payroll payroll = getPayrollById(payrollId);
        return payslipPdfGenerator.generatePayslip(payroll);
    }
}

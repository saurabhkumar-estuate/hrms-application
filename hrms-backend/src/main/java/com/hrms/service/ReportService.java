package com.hrms.service;

import com.hrms.model.EmployeeStatus;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveRepository;
import com.hrms.repository.PayrollRepository;
import com.hrms.model.LeaveStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;

    public Map<String, Object> getHeadcount() {
        Map<String, Object> report = new HashMap<>();
        report.put("total", employeeRepository.count());
        report.put("active", employeeRepository.countByStatus(EmployeeStatus.ACTIVE));
        report.put("inactive", employeeRepository.countByStatus(EmployeeStatus.INACTIVE));

        Map<String, Long> byDepartment = new HashMap<>();
        employeeRepository.findAllDepartments().forEach(dept -> {
            long count = employeeRepository.findAll().stream()
                    .filter(e -> dept.equals(e.getDepartment()))
                    .count();
            byDepartment.put(dept, count);
        });
        report.put("byDepartment", byDepartment);
        return report;
    }

    public Map<String, Object> getAttendanceSummary() {
        Map<String, Object> report = new HashMap<>();
        LocalDate today = LocalDate.now();
        report.put("todayDate", today.toString());
        report.put("totalToday", attendanceRepository.findByDate(today).size());
        return report;
    }

    public Map<String, Object> getPayrollSummary() {
        Map<String, Object> report = new HashMap<>();
        LocalDate now = LocalDate.now();
        report.put("month", now.getMonthValue());
        report.put("year", now.getYear());
        report.put("totalProcessed", payrollRepository.findByMonthAndYear(now.getMonthValue(), now.getYear()).size());
        return report;
    }

    public Map<String, Object> getLeaveSummary() {
        Map<String, Object> report = new HashMap<>();
        report.put("pending", leaveRepository.findByStatus(LeaveStatus.PENDING).size());
        report.put("approved", leaveRepository.findByStatus(LeaveStatus.APPROVED).size());
        report.put("rejected", leaveRepository.findByStatus(LeaveStatus.REJECTED).size());
        report.put("total", leaveRepository.count());
        return report;
    }
}

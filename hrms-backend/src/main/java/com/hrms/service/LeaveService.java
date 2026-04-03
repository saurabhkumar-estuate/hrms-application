package com.hrms.service;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.model.*;
import com.hrms.repository.LeaveBalanceRepository;
import com.hrms.repository.LeaveRepository;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public List<LeaveRequest> getLeavesByStatus(LeaveStatus status) {
        return leaveRepository.findByStatus(status);
    }

    public List<LeaveRequest> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveBalance> getLeaveBalance(Long employeeId) {
        int year = LocalDate.now().getYear();
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year);
    }

    @Transactional
    public LeaveRequest applyLeave(LeaveRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + dto.getEmployeeId()));

        long days = ChronoUnit.DAYS.between(dto.getFromDate(), dto.getToDate()) + 1;

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(dto.getLeaveType())
                .fromDate(dto.getFromDate())
                .toDate(dto.getToDate())
                .numberOfDays((double) days)
                .reason(dto.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        return leaveRepository.save(leaveRequest);
    }

    @Transactional
    public LeaveRequest approveLeave(Long id, String approvedBy) {
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approvedBy);

        // Update leave balance
        updateLeaveBalance(leave.getEmployee().getId(), leave.getLeaveType(),
                leave.getNumberOfDays(), true);

        return leaveRepository.save(leave);
    }

    @Transactional
    public LeaveRequest rejectLeave(Long id, String rejectedBy) {
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(rejectedBy);

        return leaveRepository.save(leave);
    }

    private void updateLeaveBalance(Long employeeId, LeaveType leaveType, Double days, boolean deduct) {
        int year = LocalDate.now().getYear();
        leaveBalanceRepository.findByEmployeeIdAndLeaveTypeAndYear(employeeId, leaveType, year)
                .ifPresent(balance -> {
                    if (deduct) {
                        balance.setUsedLeaves(balance.getUsedLeaves() + days);
                        balance.setRemainingLeaves(balance.getTotalLeaves() - balance.getUsedLeaves());
                    } else {
                        balance.setUsedLeaves(Math.max(0, balance.getUsedLeaves() - days));
                        balance.setRemainingLeaves(balance.getTotalLeaves() - balance.getUsedLeaves());
                    }
                    leaveBalanceRepository.save(balance);
                });
    }

    public long getPendingLeavesCount() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING).size();
    }
}

package com.hrms.controller;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.model.LeaveRequest;
import com.hrms.model.LeaveBalance;
import com.hrms.model.LeaveStatus;
import com.hrms.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves(
            @RequestParam(required = false) LeaveStatus status) {
        if (status != null) {
            return ResponseEntity.ok(leaveService.getLeavesByStatus(status));
        }
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequestDTO dto) {
        return ResponseEntity.ok(leaveService.applyLeave(dto));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER', 'MANAGER')")
    public ResponseEntity<LeaveRequest> approveLeave(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(leaveService.approveLeave(id, auth.getName()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER', 'MANAGER')")
    public ResponseEntity<LeaveRequest> rejectLeave(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, auth.getName()));
    }

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<List<LeaveBalance>> getLeaveBalance(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(employeeId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(employeeId));
    }
}

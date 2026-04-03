package com.hrms.dto;

import com.hrms.model.LeaveStatus;
import com.hrms.model.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private LeaveType leaveType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Double numberOfDays;
    private String reason;
    private LeaveStatus status;
    private String approvedBy;
    private LocalDateTime appliedAt;
}

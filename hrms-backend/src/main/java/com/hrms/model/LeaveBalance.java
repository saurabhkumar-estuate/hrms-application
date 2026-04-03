package com.hrms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_balances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type")
    private LeaveType leaveType;

    @Column(name = "total_leaves")
    private Double totalLeaves;

    @Column(name = "used_leaves")
    private Double usedLeaves;

    @Column(name = "remaining_leaves")
    private Double remainingLeaves;

    private Integer year;
}

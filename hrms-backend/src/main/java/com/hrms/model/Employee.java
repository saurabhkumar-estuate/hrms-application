package com.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", unique = true)
    private String employeeCode;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private String department;

    private String designation;

    private BigDecimal salary;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "pf_number")
    private String pfNumber;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "reporting_to")
    private String reportingTo;

    @Column(name = "work_location")
    private String workLocation;

    @Column(name = "employment_type")
    private String employmentType;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}

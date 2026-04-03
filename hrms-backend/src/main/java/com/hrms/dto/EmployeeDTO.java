package com.hrms.dto;

import com.hrms.model.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String panNumber;
    private String pfNumber;
    private String bankAccount;
    private String reportingTo;
    private String workLocation;
    private String employmentType;
    private EmployeeStatus status;
    private String userEmail;
    private String userPassword;
    private String role;
}

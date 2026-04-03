package com.hrms.service;

import com.hrms.dto.EmployeeDTO;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.model.*;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<Employee> getAllEmployees(String search, String department, EmployeeStatus status, Pageable pageable) {
        return employeeRepository.findWithFilters(search, department, status, pageable);
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee createEmployee(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        // Create user account
        String userEmail = dto.getUserEmail() != null ? dto.getUserEmail() : dto.getEmail();
        String userPassword = dto.getUserPassword() != null ? dto.getUserPassword() : "employee123";
        Role role = dto.getRole() != null ? Role.valueOf(dto.getRole()) : Role.EMPLOYEE;

        User user = User.builder()
                .email(userEmail)
                .password(passwordEncoder.encode(userPassword))
                .role(role)
                .active(true)
                .build();
        user = userRepository.save(user);

        // Generate employee code
        long count = employeeRepository.count() + 1;
        String employeeCode = String.format("EMP-%04d", count);

        Employee employee = Employee.builder()
                .employeeCode(employeeCode)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .designation(dto.getDesignation())
                .salary(dto.getSalary())
                .joiningDate(dto.getJoiningDate())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .address(dto.getAddress())
                .panNumber(dto.getPanNumber())
                .pfNumber(dto.getPfNumber())
                .bankAccount(dto.getBankAccount())
                .reportingTo(dto.getReportingTo())
                .workLocation(dto.getWorkLocation())
                .employmentType(dto.getEmploymentType())
                .status(dto.getStatus() != null ? dto.getStatus() : EmployeeStatus.ACTIVE)
                .user(user)
                .build();

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = getEmployeeById(id);

        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getPhone() != null) employee.setPhone(dto.getPhone());
        if (dto.getDepartment() != null) employee.setDepartment(dto.getDepartment());
        if (dto.getDesignation() != null) employee.setDesignation(dto.getDesignation());
        if (dto.getSalary() != null) employee.setSalary(dto.getSalary());
        if (dto.getJoiningDate() != null) employee.setJoiningDate(dto.getJoiningDate());
        if (dto.getDateOfBirth() != null) employee.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) employee.setGender(dto.getGender());
        if (dto.getAddress() != null) employee.setAddress(dto.getAddress());
        if (dto.getPanNumber() != null) employee.setPanNumber(dto.getPanNumber());
        if (dto.getPfNumber() != null) employee.setPfNumber(dto.getPfNumber());
        if (dto.getBankAccount() != null) employee.setBankAccount(dto.getBankAccount());
        if (dto.getReportingTo() != null) employee.setReportingTo(dto.getReportingTo());
        if (dto.getWorkLocation() != null) employee.setWorkLocation(dto.getWorkLocation());
        if (dto.getEmploymentType() != null) employee.setEmploymentType(dto.getEmploymentType());
        if (dto.getStatus() != null) employee.setStatus(dto.getStatus());

        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
    }

    public List<String> getAllDepartments() {
        return employeeRepository.findAllDepartments();
    }

    public long getTotalEmployees() {
        return employeeRepository.count();
    }

    public long getActiveEmployeesCount() {
        return employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
    }
}

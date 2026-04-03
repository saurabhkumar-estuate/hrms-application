package com.hrms.config;

import com.hrms.model.*;
import com.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already initialized, skipping...");
            return;
        }

        log.info("Initializing sample data...");

        // Create Admin
        User admin = userRepository.save(User.builder()
                .email("admin@hrms.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        // Create HR Manager
        User hrManager = userRepository.save(User.builder()
                .email("hr@hrms.com")
                .password(passwordEncoder.encode("hr123"))
                .role(Role.HR_MANAGER)
                .active(true)
                .build());

        // Create Employee Users
        List<User> empUsers = Arrays.asList(
                userRepository.save(User.builder().email("john.doe@hrms.com")
                        .password(passwordEncoder.encode("emp123")).role(Role.EMPLOYEE).active(true).build()),
                userRepository.save(User.builder().email("jane.smith@hrms.com")
                        .password(passwordEncoder.encode("emp123")).role(Role.EMPLOYEE).active(true).build()),
                userRepository.save(User.builder().email("bob.wilson@hrms.com")
                        .password(passwordEncoder.encode("emp123")).role(Role.MANAGER).active(true).build()),
                userRepository.save(User.builder().email("alice.johnson@hrms.com")
                        .password(passwordEncoder.encode("emp123")).role(Role.EMPLOYEE).active(true).build()),
                userRepository.save(User.builder().email("charlie.brown@hrms.com")
                        .password(passwordEncoder.encode("emp123")).role(Role.EMPLOYEE).active(true).build())
        );

        // Create Employees
        List<Employee> employees = Arrays.asList(
                createEmployee("EMP-0001", "John", "Doe", "john.doe@hrms.com", "9876543210",
                        "Engineering", "Senior Software Engineer", new BigDecimal("85000"),
                        LocalDate.of(2021, 3, 15), LocalDate.of(1990, 5, 20),
                        "Male", "123 Tech Street, Bangalore", "ABCDE1234F",
                        "PF001", "1234567890", "Bob Wilson", "Bangalore", "Full-time", empUsers.get(0)),
                createEmployee("EMP-0002", "Jane", "Smith", "jane.smith@hrms.com", "9876543211",
                        "Human Resources", "HR Specialist", new BigDecimal("65000"),
                        LocalDate.of(2020, 6, 1), LocalDate.of(1992, 8, 15),
                        "Female", "456 Garden Road, Hyderabad", "FGHIJ5678K",
                        "PF002", "0987654321", "Bob Wilson", "Hyderabad", "Full-time", empUsers.get(1)),
                createEmployee("EMP-0003", "Bob", "Wilson", "bob.wilson@hrms.com", "9876543212",
                        "Engineering", "Engineering Manager", new BigDecimal("120000"),
                        LocalDate.of(2019, 1, 10), LocalDate.of(1985, 3, 25),
                        "Male", "789 Manager Lane, Pune", "KLMNO9012P",
                        "PF003", "1122334455", null, "Pune", "Full-time", empUsers.get(2)),
                createEmployee("EMP-0004", "Alice", "Johnson", "alice.johnson@hrms.com", "9876543213",
                        "Finance", "Financial Analyst", new BigDecimal("70000"),
                        LocalDate.of(2022, 2, 14), LocalDate.of(1995, 11, 8),
                        "Female", "321 Finance Ave, Mumbai", "PQRST3456U",
                        "PF004", "5566778899", "Bob Wilson", "Mumbai", "Full-time", empUsers.get(3)),
                createEmployee("EMP-0005", "Charlie", "Brown", "charlie.brown@hrms.com", "9876543214",
                        "Marketing", "Marketing Executive", new BigDecimal("55000"),
                        LocalDate.of(2023, 4, 3), LocalDate.of(1998, 7, 12),
                        "Male", "654 Marketing Blvd, Delhi", "UVWXY7890Z",
                        "PF005", "9988776655", "Bob Wilson", "Delhi", "Full-time", empUsers.get(4))
        );

        employees.forEach(employeeRepository::save);

        // Create Leave Balances for each employee
        int currentYear = LocalDate.now().getYear();
        for (Employee emp : employees) {
            for (LeaveType leaveType : LeaveType.values()) {
                double total = switch (leaveType) {
                    case CASUAL -> 12.0;
                    case SICK -> 12.0;
                    case ANNUAL -> 15.0;
                    case MATERNITY -> 90.0;
                    case PATERNITY -> 15.0;
                };
                leaveBalanceRepository.save(LeaveBalance.builder()
                        .employee(emp)
                        .leaveType(leaveType)
                        .totalLeaves(total)
                        .usedLeaves(0.0)
                        .remainingLeaves(total)
                        .year(currentYear)
                        .build());
            }
        }

        // Create Sample Attendance (last 5 working days)
        LocalDate today = LocalDate.now();
        for (Employee emp : employees) {
            for (int i = 0; i < 5; i++) {
                LocalDate date = today.minusDays(i);
                if (date.getDayOfWeek().getValue() <= 5) { // Mon-Fri
                    attendanceRepository.save(Attendance.builder()
                            .employee(emp)
                            .date(date)
                            .checkIn(LocalTime.of(9, 0 + (i * 5)))
                            .checkOut(LocalTime.of(18, 0))
                            .workingHours(9.0)
                            .status(i == 0 ? AttendanceStatus.PRESENT : AttendanceStatus.PRESENT)
                            .build());
                }
            }
        }

        // Create Sample Leave Requests
        leaveRepository.save(LeaveRequest.builder()
                .employee(employees.get(0))
                .leaveType(LeaveType.CASUAL)
                .fromDate(today.plusDays(3))
                .toDate(today.plusDays(4))
                .numberOfDays(2.0)
                .reason("Personal work")
                .status(LeaveStatus.PENDING)
                .build());

        leaveRepository.save(LeaveRequest.builder()
                .employee(employees.get(1))
                .leaveType(LeaveType.SICK)
                .fromDate(today.minusDays(10))
                .toDate(today.minusDays(9))
                .numberOfDays(2.0)
                .reason("Fever and cold")
                .status(LeaveStatus.APPROVED)
                .approvedBy("hr@hrms.com")
                .build());

        leaveRepository.save(LeaveRequest.builder()
                .employee(employees.get(2))
                .leaveType(LeaveType.ANNUAL)
                .fromDate(today.plusDays(10))
                .toDate(today.plusDays(14))
                .numberOfDays(5.0)
                .reason("Family vacation")
                .status(LeaveStatus.PENDING)
                .build());

        log.info("Sample data initialized successfully!");
        log.info("Login credentials:");
        log.info("  Admin: admin@hrms.com / admin123");
        log.info("  HR Manager: hr@hrms.com / hr123");
        log.info("  Employee: john.doe@hrms.com / emp123");
    }

    private Employee createEmployee(String code, String firstName, String lastName, String email,
                                     String phone, String department, String designation,
                                     BigDecimal salary, LocalDate joiningDate, LocalDate dob,
                                     String gender, String address, String pan, String pf,
                                     String bankAccount, String reportingTo, String location,
                                     String empType, User user) {
        return Employee.builder()
                .employeeCode(code)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .department(department)
                .designation(designation)
                .salary(salary)
                .joiningDate(joiningDate)
                .dateOfBirth(dob)
                .gender(gender)
                .address(address)
                .panNumber(pan)
                .pfNumber(pf)
                .bankAccount(bankAccount)
                .reportingTo(reportingTo)
                .workLocation(location)
                .employmentType(empType)
                .status(EmployeeStatus.ACTIVE)
                .user(user)
                .build();
    }
}

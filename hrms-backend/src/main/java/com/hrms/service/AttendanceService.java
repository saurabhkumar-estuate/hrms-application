package com.hrms.service;

import com.hrms.exception.ResourceNotFoundException;
import com.hrms.model.*;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    public List<Attendance> getMonthlyAttendance(Long employeeId, int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, start, end);
    }

    @Transactional
    public Attendance checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Attendance existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElse(null);

        if (existing != null && existing.getCheckIn() != null) {
            throw new IllegalArgumentException("Already checked in today");
        }

        AttendanceStatus status = now.isAfter(LocalTime.of(9, 30))
                ? AttendanceStatus.LATE
                : AttendanceStatus.PRESENT;

        Attendance attendance;
        if (existing != null) {
            existing.setCheckIn(now);
            existing.setStatus(status);
            attendance = existing;
        } else {
            attendance = Attendance.builder()
                    .employee(employee)
                    .date(today)
                    .checkIn(now)
                    .status(status)
                    .build();
        }
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new ResourceNotFoundException("No check-in found for today"));

        LocalTime now = LocalTime.now();
        attendance.setCheckOut(now);

        if (attendance.getCheckIn() != null) {
            double hours = (now.toSecondOfDay() - attendance.getCheckIn().toSecondOfDay()) / 3600.0;
            attendance.setWorkingHours(Math.round(hours * 100.0) / 100.0);
            if (hours < 4.5) {
                attendance.setStatus(AttendanceStatus.HALF_DAY);
            }
        }

        return attendanceRepository.save(attendance);
    }

    public long getTodayPresentCount() {
        return attendanceRepository.findByDate(LocalDate.now()).stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT || a.getStatus() == AttendanceStatus.LATE)
                .count();
    }
}

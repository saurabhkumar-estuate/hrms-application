package com.hrms.controller;

import com.hrms.model.Attendance;
import com.hrms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    public ResponseEntity<Attendance> checkIn(@RequestBody Map<String, Long> request) {
        return ResponseEntity.ok(attendanceService.checkIn(request.get("employeeId")));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Attendance> checkOut(@RequestBody Map<String, Long> request) {
        return ResponseEntity.ok(attendanceService.checkOut(request.get("employeeId")));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employeeId));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getTodayAttendance() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    @GetMapping("/monthly/{employeeId}")
    public ResponseEntity<List<Attendance>> getMonthlyAttendance(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getMonthlyAttendance(employeeId, month, year));
    }
}

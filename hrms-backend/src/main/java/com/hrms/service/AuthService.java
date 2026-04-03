package com.hrms.service;

import com.hrms.dto.LoginRequest;
import com.hrms.dto.LoginResponse;
import com.hrms.model.Employee;
import com.hrms.model.Role;
import com.hrms.model.User;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.UserRepository;
import com.hrms.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserDetails userDetails = loadUserByUsername(request.getEmail());

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());

        String token = jwtUtil.generateToken(userDetails, extraClaims);

        String fullName = "";
        Long employeeId = null;
        Optional<Employee> employeeOpt = employeeRepository.findByUserId(user.getId());
        if (employeeOpt.isPresent()) {
            Employee emp = employeeOpt.get();
            fullName = emp.getFirstName() + " " + emp.getLastName();
            employeeId = emp.getId();
        } else if (user.getRole() == Role.ADMIN || user.getRole() == Role.HR_MANAGER) {
            fullName = user.getEmail().split("@")[0];
        }

        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .employeeId(employeeId)
                .fullName(fullName)
                .build();
    }

    public User register(String email, String password, Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .active(true)
                .build();
        return userRepository.save(user);
    }
}

package com.livecommerce.auth_service.config;

import com.livecommerce.auth_service.entity.User;
import com.livecommerce.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(usernameOrEmail)
                .or(() -> userRepository.findByUsername(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));

        // ✅ Convert enum to String with ROLE_ prefix for Spring Security
        String roleName = user.getRole() != null ? user.getRole().name() : "USER";
        String role = "ROLE_" + roleName;

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // using email as username (subject)
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}
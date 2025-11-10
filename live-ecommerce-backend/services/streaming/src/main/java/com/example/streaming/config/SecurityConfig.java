package com.example.streaming.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/oauth2/authorization/google").permitAll()
                .requestMatchers("/api/youtube/auth-status").permitAll()
                .requestMatchers("/api/youtube/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2Login -> oauth2Login
                .loginPage("/oauth2/authorization/google")
                .defaultSuccessUrl("http://localhost:3000/", true)
                .failureUrl("/error")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("http://localhost:3000/") // FIXED: Removed 'true' boolean
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
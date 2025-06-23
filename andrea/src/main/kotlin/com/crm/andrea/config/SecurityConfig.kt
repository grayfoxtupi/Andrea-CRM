package com.crm.andrea.config

import com.crm.andrea.service.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests {
                it.anyRequest().authenticated()
            }
            .formLogin { form ->
                form
                    .loginPage("/login")
                    .permitAll()
            }
            .httpBasic { it.disable() }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf(
            "http://localhost:5173",        // React Web (Vite)
            "http://localhost:19006",       // Expo Go (Web)
            "http://localhost:8081",        // Metro bundler (React Native)
            "http://10.0.2.2:8081",         // Android Emulator
            "http://127.0.0.1:5173",        // Alternativa localhost
            "http://localhost"              // Electron ou WebView nativa
        )
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    fun authenticationManager(
        userDetailsService: UserDetailsService, passwordEncoder: PasswordEncoder): AuthenticationManager {

        val authenticationProvider = DaoAuthenticationProvider()
        authenticationProvider.setUserDetailsService(userDetailsService)
        authenticationProvider.setPasswordEncoder(passwordEncoder)

        return ProviderManager(authenticationProvider)
    }

    @Bean
    fun userDetailsService(userService: UserService): UserDetailsService {
        return UserDetailsService { username ->
            val user = userService.getAllUsers()
                .find { it.email == username }
                ?: throw UsernameNotFoundException("User not found with email: $username")

            User.builder()
                .username(user.email)
                .password(user.password)
                .roles("USER") // ou user.roles.toTypedArray() se tiver roles dinâmicos
                .build()
        }
    }

}

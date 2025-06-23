package com.crm.andrea.controller



import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpSession
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*



@RestController
@RequestMapping("/logins")
class LoginController (
    private val authenticationManager: AuthenticationManager
)
{

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<String> {
        println("Usuário tentou logar: ${loginRequest.username}")

        return try {
            val authentication = UsernamePasswordAuthenticationToken(
                loginRequest.username,
                loginRequest.password
            )

            // Autentica o usuário com o AuthenticationManager
            authenticationManager.authenticate(authentication)

            SecurityContextHolder.getContext().authentication = authentication

            ResponseEntity.ok("Login realizado com sucesso.")
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.")
        }
    }

    data class LoginRequest(val username: String, val password: String)


    @GetMapping("/login")
    fun login(): String {

        return "login"
    }

    @GetMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<String> {
        request.getSession(false)?.invalidate()
        return ResponseEntity.ok("Sessão encerrada.")
    }

    @GetMapping("/check")
    fun checkAuth(session: HttpSession): ResponseEntity<String> {
        return if (session.getAttribute("SPRING_SECURITY_CONTEXT") != null) {
            ResponseEntity.ok("Usuário autenticado")
        } else {
            ResponseEntity.status(401).body("Não autenticado")
        }
    }

}
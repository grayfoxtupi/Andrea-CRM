package com.crm.andrea.config

import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component
import com.crm.andrea.model.grc.AndreaUser
import com.crm.andrea.repository.UserRepo

@Component
class DataInitializer(private val userRepository: UserRepo) {

    @PostConstruct
    fun init() {
        val email = "joao@ex.com"
        if (!userRepository.existsByEmail(email)) {
            val user = AndreaUser(
                userId = 0,
                name = "João Silva",
                email = email,
                password = "senha123" // 🔥 Senha salva em texto puro (mock, sem segurança)
            )
            userRepository.save(user)
            println("Usuário 'João Silva' criado no banco de dados (sem segurança).")
        }
    }
}

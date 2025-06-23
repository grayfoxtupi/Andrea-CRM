package com.crm.andrea.service

import com.crm.andrea.model.grc.AndreaUser
import com.crm.andrea.repository.UserRepo
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepo) {

    fun createUser(user: AndreaUser): AndreaUser {
        return userRepository.save(user)
    }

    fun getUserById(id: Long): AndreaUser? {
        return userRepository.findById(id).orElse(null)
    }

    fun getAllUsers(): List<AndreaUser> {
        return userRepository.findAll()
    }

    fun updateUser(id: Long, updatedUser: AndreaUser): AndreaUser? {
        return userRepository.findById(id).map { existingUser ->
            existingUser.name = updatedUser.name
            existingUser.email = updatedUser.email
            existingUser.password = updatedUser.password
            userRepository.save(existingUser)
        }.orElse(null)
    }

    fun deleteUser(id: Long): Boolean {
        return if (userRepository.existsById(id)) {
            userRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}

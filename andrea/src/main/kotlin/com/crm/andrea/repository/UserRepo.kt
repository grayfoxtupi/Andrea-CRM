package com.crm.andrea.repository

import com.crm.andrea.model.grc.AndreaUser
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepo : JpaRepository<AndreaUser, Long> {


    // Optional custom method (not required for basic CRUD)
    fun findByEmail(email: String): AndreaUser?
    fun existsByEmail(email: String): Boolean  // <-- add this line

    // You do NOT need to manually declare these, they are inherited from JpaRepository:
    // fun findAll(): List<User>
    // fun findById(id: Long): Optional<User>
    // fun save(user: User): User
    // fun delete(user: User)
    // fun deleteById(id: Long)

}
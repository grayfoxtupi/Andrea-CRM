package com.crm.andrea.repository

import com.crm.andrea.model.grc.Client
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClientRepo : JpaRepository<Client, Long> {


    // Optional custom method (not required for basic CRUD)
    fun findByClientId(clientId: Long): Client?
    fun existsByClientId(clientId: Long): Boolean


    // You do NOT need to manually declare these, they are inherited from JpaRepository:
    // fun findAll(): List<User>
    // fun findById(id: Long): Optional<User>
    // fun save(user: User): User
    // fun delete(user: User)
    // fun deleteById(id: Long)

}
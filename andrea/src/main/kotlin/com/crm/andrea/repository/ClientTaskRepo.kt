package com.crm.andrea.repository

import com.crm.andrea.model.tasks.ClientTask
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClientTaskRepo : JpaRepository<ClientTask, Long> {


    // Optional custom method (not required for basic CRUD)
    fun findByTaskId(taskId: Long): ClientTask?
    fun existsByTaskId(taskId: Long): Boolean

    // You do NOT need to manually declare these, they are inherited from JpaRepository:
    // fun findAll(): List<User>
    // fun findById(id: Long): Optional<User>
    // fun save(user: User): User
    // fun delete(user: User)
    // fun deleteById(id: Long)

}
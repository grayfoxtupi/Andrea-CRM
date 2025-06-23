package com.crm.andrea.repository

import com.crm.andrea.model.tasks.LeadTask
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface LeadTaskRepo : JpaRepository<LeadTask, Long> {


    // Optional custom method (not required for basic CRUD)
    fun findByLeadTaskId(leadTaskId: Long): LeadTask?
    fun existsByLeadTaskId(leadTaskId: Long): Boolean

    @Transactional
    @Modifying
    @Query("DELETE FROM LeadTask lt WHERE lt.lead.leadId = :leadId")
    fun deleteByLeadId(leadId: Long)

    // You do NOT need to manually declare these, they are inherited from JpaRepository:
    // fun findAll(): List<User>
    // fun findById(id: Long): Optional<User>
    // fun save(user: User): User
    // fun delete(user: User)
    // fun deleteById(id: Long)

}
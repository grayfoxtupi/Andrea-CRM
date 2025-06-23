package com.crm.andrea.repository

import com.crm.andrea.model.grc.Company
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CompanyRepo : JpaRepository<Company, Long> {

    fun findByCompanyId(companyId: Long): Company?
    fun existsByCompanyId(companyId: Long): Boolean

    // Métodos básicos já inclusos no JpaRepository:
    // - findAll()
    // - findById(id: Long)
    // - save(entity)
    // - deleteById(id: Long)
    // - delete(entity)
}

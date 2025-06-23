package com.crm.andrea.controller

import com.crm.andrea.model.grc.Company
import com.crm.andrea.service.CompanyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/companies")
class CompanyController(private val companyService: CompanyService) {

    @GetMapping
    fun getAllCompanies(): List<Company> {
        println("GET COMPANIES chamado")
        return companyService.getAllCompanies()
    }

    @GetMapping("/{id}")
    fun getCompanyById(@PathVariable id: Long): ResponseEntity<Company> {
        val company = companyService.getCompanyById(id)
        return if (company != null) {
            ResponseEntity.ok(company)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createCompany(@RequestBody company: Company): Company {
        println("CREATE COMPANY chamado com: $company")
        return companyService.createCompany(company)
    }

    @PutMapping("/{id}")
    fun updateCompany(@PathVariable id: Long, @RequestBody company: Company): ResponseEntity<Company> {
        val updated = companyService.updateCompany(id, company)
        return if (updated != null) {
            ResponseEntity.ok(updated)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteCompany(@PathVariable id: Long): ResponseEntity<Void> {
        return if (companyService.deleteCompany(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

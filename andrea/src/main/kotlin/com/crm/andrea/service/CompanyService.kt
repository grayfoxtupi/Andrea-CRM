package com.crm.andrea.service

import com.crm.andrea.model.grc.Company
import com.crm.andrea.repository.CompanyRepo
import org.springframework.stereotype.Service

@Service
class CompanyService(private val companyRepository: CompanyRepo) {

    fun getAllCompanies(): List<Company> {
        return companyRepository.findAll()
    }

    fun getCompanyById(id: Long): Company? {
        return companyRepository.findById(id).orElse(null)
    }

    fun createCompany(company: Company): Company {
        return companyRepository.save(company)
    }

    fun updateCompany(id: Long, updatedCompany: Company): Company? {
        return companyRepository.findById(id).map { existingCompany ->
            existingCompany.apply {
                companyName = updatedCompany.companyName
                cnpj = updatedCompany.cnpj
                description = updatedCompany.description
                companyEmail = updatedCompany.companyEmail
                companyPhoneNumber = updatedCompany.companyPhoneNumber
                businessArea = updatedCompany.businessArea
            }
            companyRepository.save(existingCompany)
        }.orElse(null)
    }

    fun deleteCompany(id: Long): Boolean {
        return if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}

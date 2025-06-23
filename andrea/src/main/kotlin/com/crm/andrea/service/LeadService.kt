package com.crm.andrea.service

import com.crm.andrea.model.grc.Lead
import com.crm.andrea.repository.CompanyRepo
import com.crm.andrea.repository.LeadRepo
import org.springframework.stereotype.Service

@Service
class LeadService(
    private val leadRepo: LeadRepo,
    private val companyRepo: CompanyRepo
) {

    fun findAll(): List<Lead> = leadRepo.findAll()

    fun findById(id: Long): Lead? = leadRepo.findById(id).orElse(null)

    fun findByLeadId(leadId: Long): Lead? = leadRepo.findByLeadId(leadId)

    fun existsByLeadId(leadId: Long): Boolean = leadRepo.existsByLeadId(leadId)

    fun saveWithCompany(lead: Lead): Lead {
        val companyId = lead.company?.companyId

        if (companyId == null) {
            // 🔥 Criar nova empresa (validação dos campos obrigatórios aqui)
            if (lead.company!!.companyName.isBlank() || lead.company!!.cnpj.isBlank()) {
                throw IllegalArgumentException("Dados da empresa obrigatórios para novo cadastro")
            }
            lead.company = companyRepo.save(lead.company!!)
        } else {
            // 🔥 Usar empresa existente
            val existingCompany = companyRepo.findById(companyId).orElseThrow {
                IllegalArgumentException("Empresa com ID $companyId não encontrada.")
            }
            lead.company = existingCompany
        }

        return leadRepo.save(lead)
    }

//    fun saveWithCompany(lead: Lead): Lead {
//        val companyId = lead.company?.companyId
//
//        if (companyId == null || companyId == 0L) {
//            // 🔥 Cria a empresa se não veio ID
//            lead.company = companyRepo.save(lead.company)
//        } else {
//            // 🔥 Verifica se a empresa existe no banco
//            val existingCompany = companyRepo.findById(companyId).orElseThrow {
//                IllegalArgumentException("Empresa com ID $companyId não encontrada.")
//            }
//            lead.company = existingCompany
//        }
//
//        return leadRepo.save(lead)
//    }

    fun save(lead: Lead): Lead = leadRepo.save(lead)

    fun deleteById(id: Long) = leadRepo.deleteById(id)
}
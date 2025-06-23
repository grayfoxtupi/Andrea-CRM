package com.crm.andrea.controller

import com.crm.andrea.model.grc.Client
import com.crm.andrea.model.grc.Lead
import com.crm.andrea.service.CompanyService
import com.crm.andrea.service.LeadService
import com.crm.andrea.service.grc.ClientService
import com.crm.andrea.service.tasks.LeadTaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/leads")
class LeadController(private val leadService: LeadService,
                     private val clientService: ClientService,
                     private val leadTaskService: LeadTaskService,
                     private val companyService: CompanyService
) {

    @GetMapping
    fun getAllLeads(): List<Lead> = leadService.findAll()

    @GetMapping("/{id}")
    fun getLeadById(@PathVariable id: Long): ResponseEntity<Lead> {
        val lead = leadService.findById(id)
        return if (lead != null) ResponseEntity.ok(lead)
        else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createLead(@RequestBody lead: Lead): ResponseEntity<Lead> {
        println("resposta 1")

        return ResponseEntity.ok(leadService.saveWithCompany(lead))
    }

    @PutMapping("/{id}")
    fun updateLead(@PathVariable id: Long, @RequestBody updatedLead: Lead): ResponseEntity<Lead> {
        val existingLead = leadService.findById(id)
        return if (existingLead != null) {
            existingLead.company = updatedLead.company
            existingLead.date = updatedLead.date
            existingLead.communicationChannel = updatedLead.communicationChannel
            existingLead.location = updatedLead.location
            existingLead.offer = updatedLead.offer
            existingLead.isLead = updatedLead.isLead

            ResponseEntity.ok(leadService.save(existingLead))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteLead(@PathVariable id: Long): ResponseEntity<Void> {
        return if (leadService.existsByLeadId(id)) {
            leadService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{leadId}/promote")
    fun promoteLeadToClient(@PathVariable leadId: Long): ResponseEntity<String> {
        val lead = leadService.findById(leadId)
            ?: return ResponseEntity.notFound().build()

        val company = lead.company
            ?: return ResponseEntity.badRequest().body("Company not found for this lead.")

        val client = Client(
            companyName = company.companyName,
            cnpj = company.cnpj,
            description = company.description,
            companyEmail = company.companyEmail,
            companyPhoneNumber = company.companyPhoneNumber,
            businessArea = company.businessArea
        )

        clientService.save(client)

        leadTaskService.deleteByLeadId(leadId)
        leadService.deleteById(leadId)
        companyService.deleteCompany(company.companyId!!)

        return ResponseEntity.ok("Lead promoted to Client successfully.")
    }
}



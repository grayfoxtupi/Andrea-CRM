package com.crm.andrea.controller

import com.crm.andrea.model.tasks.LeadTask
import com.crm.andrea.service.LeadService
import com.crm.andrea.service.tasks.LeadTaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/lead-tasks")
class LeadTaskController(private val leadTaskService: LeadTaskService, private val leadService: LeadService) {

    @GetMapping
    fun getAllLeadTasks(): List<LeadTask> = leadTaskService.findAll()

    @PostMapping
    fun createLeadTask(@RequestBody leadTask: LeadTask): ResponseEntity<Any> {
        try {
            val leadId = leadTask.lead.leadId
                ?: return ResponseEntity.badRequest().body("Lead ID é obrigatório")

            val lead = leadService.findById(leadId)
                ?: return ResponseEntity.badRequest().body("Lead não encontrado")

            leadTask.lead = lead

            // 🔥 Verificar conflito de data
            val companyId = lead.company.companyId
                ?: return ResponseEntity.badRequest().body("Empresa não encontrada")

            val hasConflict = leadTaskService.findAll().any { task ->
                task.lead.company.companyId == companyId &&
                        (task.taskBegin == leadTask.taskBegin || task.taskEnd == leadTask.taskBegin)
            }

            if (hasConflict) {
                return ResponseEntity.badRequest().body(
                    "Já existe uma reunião marcada para essa empresa na data ${leadTask.taskBegin}."
                )
            }

            val saved = leadTaskService.save(leadTask)
            return ResponseEntity.ok(saved)

        } catch (ex: Exception) {
            ex.printStackTrace()
            return ResponseEntity.internalServerError().body("Erro interno: ${ex.message}")
        }
    }

    @PutMapping("/{id}")
    fun updateLeadTask(@PathVariable id: Long, @RequestBody updatedTask: LeadTask): ResponseEntity<LeadTask> {
        val existingTask = leadTaskService.findById(id)
        return if (existingTask != null) {
            existingTask.contact = updatedTask.contact
            existingTask.place = updatedTask.place
            existingTask.contactMethod = updatedTask.contactMethod
            existingTask.feedback = updatedTask.feedback
            existingTask.taskBegin = updatedTask.taskBegin
            existingTask.taskEnd = updatedTask.taskEnd
            existingTask.lead = updatedTask.lead
            existingTask.taskStatus = updatedTask.taskStatus

            ResponseEntity.ok(leadTaskService.save(existingTask))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteLeadTask(@PathVariable id: Long): ResponseEntity<Void> {
        return if (leadTaskService.existsByLeadTaskId(id)) {
            leadTaskService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

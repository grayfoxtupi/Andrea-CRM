package com.crm.andrea.service.tasks

import com.crm.andrea.model.tasks.LeadTask
import com.crm.andrea.repository.LeadTaskRepo
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class LeadTaskService(private val leadTaskRepo: LeadTaskRepo) {

    fun findAll(): List<LeadTask> = leadTaskRepo.findAll()

    fun findById(id: Long): LeadTask? = leadTaskRepo.findById(id).orElse(null)

    fun save(leadTask: LeadTask): LeadTask = leadTaskRepo.save(leadTask)

    fun deleteById(id: Long) = leadTaskRepo.deleteById(id)

    fun deleteByLeadId(leadId: Long) = leadTaskRepo.deleteByLeadId(leadId)

    fun existsByLeadTaskId(id: Long): Boolean = leadTaskRepo.existsByLeadTaskId(id)

    fun existsTaskConflict(leadCompanyId: Long, taskDate: LocalDate): Boolean {
        val allTasks = leadTaskRepo.findAll()

        return allTasks.any { task ->
            task.lead.company.companyId == leadCompanyId &&
                    (task.taskBegin == taskDate || task.taskEnd == taskDate)
        }
    }
}
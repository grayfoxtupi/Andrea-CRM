package com.crm.andrea.service.tasks

import com.crm.andrea.model.tasks.ClientTask
import com.crm.andrea.repository.ClientTaskRepo
import org.springframework.stereotype.Service

@Service
class ClientTaskService(private val clientTaskRepo: ClientTaskRepo) {

    fun findAll(): List<ClientTask> = clientTaskRepo.findAll()

    fun findById(id: Long): ClientTask? = clientTaskRepo.findById(id).orElse(null)

    fun save(clientTask: ClientTask): ClientTask = clientTaskRepo.save(clientTask)

    fun deleteById(id: Long) = clientTaskRepo.deleteById(id)

    fun existsByTaskId(id: Long): Boolean = clientTaskRepo.existsByTaskId(id)
}

package com.crm.andrea.controller

import com.crm.andrea.model.tasks.ClientTask
import com.crm.andrea.service.tasks.ClientTaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/client-tasks")
class ClientTaskController(private val clientTaskService: ClientTaskService) {

    @GetMapping
    fun getAllClientTasks(): List<ClientTask> = clientTaskService.findAll()

    @GetMapping("/{id}")
    fun getClientTaskById(@PathVariable id: Long): ResponseEntity<ClientTask> {
        val task = clientTaskService.findById(id)
        return if (task != null) ResponseEntity.ok(task)
        else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createClientTask(@RequestBody task: ClientTask): ClientTask = clientTaskService.save(task)

    @PutMapping("/{id}")
    fun updateClientTask(@PathVariable id: Long, @RequestBody updatedTask: ClientTask): ResponseEntity<ClientTask> {
        val existingTask = clientTaskService.findById(id)
        return if (existingTask != null) {
            existingTask.meetingTopic = updatedTask.meetingTopic
            existingTask.taskBegin = updatedTask.taskBegin
            existingTask.taskEnd = updatedTask.taskEnd
            existingTask.projectDescription = updatedTask.projectDescription
            existingTask.notes = updatedTask.notes
            existingTask.client = updatedTask.client
            existingTask.taskStatus = updatedTask.taskStatus


            ResponseEntity.ok(clientTaskService.save(existingTask))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteClientTask(@PathVariable id: Long): ResponseEntity<Void> {
        return if (clientTaskService.existsByTaskId(id)) {
            clientTaskService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

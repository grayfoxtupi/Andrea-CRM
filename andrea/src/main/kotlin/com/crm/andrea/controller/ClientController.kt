package com.crm.andrea.controller

import com.crm.andrea.model.grc.Client
import com.crm.andrea.service.grc.ClientService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clients")
class ClientController(private val clientService: ClientService) {

    @GetMapping
    fun getAllClients(): List<Client> = clientService.findAll()

    @GetMapping("/{id}")
    fun getClientById(@PathVariable id: Long): ResponseEntity<Client> {
        val client = clientService.findById(id)
        return if (client != null) {
            ResponseEntity.ok(client)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createClient(@RequestBody client: Client): Client {
        return clientService.save(client)
    }

    @PutMapping("/{id}")
    fun updateClient(@PathVariable id: Long, @RequestBody updatedClient: Client): ResponseEntity<Client> {
        val existingClient = clientService.findById(id)
        return if (existingClient != null) {
            existingClient.apply {
                companyName = updatedClient.companyName
                cnpj = updatedClient.cnpj
                description = updatedClient.description
                companyEmail = updatedClient.companyEmail
                companyPhoneNumber = updatedClient.companyPhoneNumber
                businessArea = updatedClient.businessArea
                status = updatedClient.status
            }
            ResponseEntity.ok(clientService.save(existingClient))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/{id}/archive")
    fun archiveClient(@PathVariable id: Long): ResponseEntity<Client> {
        val client = clientService.findById(id) ?: return ResponseEntity.notFound().build()
        client.status = "Inativo"
        return ResponseEntity.ok(clientService.save(client))
    }

    @PutMapping("/{id}/unarchive")
    fun unarchiveClient(@PathVariable id: Long): ResponseEntity<Client> {
        val client = clientService.findById(id) ?: return ResponseEntity.notFound().build()
        client.status = "Ativo"
        return ResponseEntity.ok(clientService.save(client))
    }


    @DeleteMapping("/{id}")
    fun deleteClient(@PathVariable id: Long): ResponseEntity<Void> {
        return if (clientService.existsByClientId(id)) {
            clientService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}


//@RequestMapping("/api/clients")
//class ClientController(private val clientService: ClientService) {
//
//    @GetMapping
//    fun getAllClients(): List<Client> = clientService.findAll()
//
//    @GetMapping("/{id}")
//    fun getClientById(@PathVariable id: Long): ResponseEntity<Client> {
//        val client = clientService.findById(id)
//        return if (client != null) ResponseEntity.ok(client)
//        else ResponseEntity.notFound().build()
//    }
//
//    @PostMapping
//    fun createClient(@RequestBody client: Client): Client = clientService.save(client)
//
//    @PutMapping("/{id}")
//    fun updateClient(@PathVariable id: Long, @RequestBody updatedClient: Client): ResponseEntity<Client> {
//        val existingClient = clientService.findById(id)
//        return if (existingClient != null) {
//            existingClient.position = updatedClient.position
//            existingClient.companyId = updatedClient.companyId
//            existingClient.location = updatedClient.location
//            existingClient.birthdayDate = updatedClient.birthdayDate
//            existingClient.clientEmail = updatedClient.clientEmail
//            existingClient.clientPhoneNumber = updatedClient.clientPhoneNumber
//            existingClient.skype = updatedClient.skype
//
//            ResponseEntity.ok(clientService.save(existingClient))
//        } else {
//            ResponseEntity.notFound().build()
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    fun deleteClient(@PathVariable id: Long): ResponseEntity<Void> {
//        return if (clientService.existsByClientId(id)) {
//            clientService.deleteById(id)
//            ResponseEntity.noContent().build()
//        } else {
//            ResponseEntity.notFound().build()
//        }
//    }
//}

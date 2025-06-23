package com.crm.andrea.service.grc

import com.crm.andrea.model.grc.Client
import com.crm.andrea.repository.ClientRepo
import org.springframework.stereotype.Service

@Service
class ClientService(private val clientRepo: ClientRepo) {

    fun findAll(): List<Client> = clientRepo.findAll()

    fun findById(id: Long): Client? = clientRepo.findById(id).orElse(null)

    fun save(client: Client): Client = clientRepo.save(client)

    fun deleteById(id: Long) = clientRepo.deleteById(id)

    fun existsByClientId(id: Long): Boolean = clientRepo.existsByClientId(id)
}

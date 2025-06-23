package com.crm.andrea.controller

import com.crm.andrea.model.grc.AndreaUser
import com.crm.andrea.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {

    @PostMapping
    fun createUser(@RequestBody user: AndreaUser): ResponseEntity<AndreaUser> =
        ResponseEntity.ok(userService.createUser(user))

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: Long): ResponseEntity<AndreaUser> {
        val user = userService.getUserById(id)
        return if (user != null) ResponseEntity.ok(user)
        else ResponseEntity.notFound().build()
    }

    @GetMapping
    fun getAllUsers(): ResponseEntity<List<AndreaUser>> = ResponseEntity.ok(userService.getAllUsers())

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody user: AndreaUser): ResponseEntity<AndreaUser> {
        val updated = userService.updateUser(id, user)
        return if (updated != null) ResponseEntity.ok(updated)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Void> {
        return if (userService.deleteUser(id)) ResponseEntity.noContent().build()
        else ResponseEntity.notFound().build()
    }
}

package com.crm.andrea.controller

import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SessionController {

    @GetMapping("/session-info")
    fun sessionInfo(session: HttpSession): String {
        return "Session ID: ${session.id}"
    }
}
package com.crm.andrea.controller

import com.crm.andrea.service.PhantomBusterService
import com.crm.andrea.model.grc.Lead
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/linkedin-search")
class LeadGenerationController(
    private val phantomBusterService: PhantomBusterService
) {
    @Value("\${default.searchUrl}")
    private lateinit var defaultSearchUrl: String

    @Value("\${default.sessionCookie}")
    private lateinit var defaultSessionCookie: String

    @PostMapping("/start")
    fun startSearch(): Mono<ResponseEntity<String>> {
        return phantomBusterService.launchSearch(defaultSearchUrl, defaultSessionCookie)
            .map { ResponseEntity.ok(it) }
    }

    @GetMapping("/results")
    fun getSearchResults(
        @RequestParam containerId: String,
        @RequestParam(defaultValue = "4") limit: Int
    ): Mono<ResponseEntity<List<Lead>>> {
        return phantomBusterService.getLeads(containerId)
            .take(limit.toLong())
            .collectList()
            .map { ResponseEntity.ok(it) }
    }
}
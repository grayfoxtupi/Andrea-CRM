package com.crm.andrea.service

import com.crm.andrea.model.grc.Lead
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class PhantomBusterService(
    private val webClient: WebClient
) {
    @Value("\${default.phantomId}")
    private lateinit var defaultPhantomId: String

    fun launchSearch(searchUrl: String, cookie: String): Mono<String> {
        val requestBody = mapOf(
            "id" to defaultPhantomId,
            "argument" to mapOf(
                "search" to searchUrl,
                "sessionCookie" to cookie
            )
        )

        return webClient.post()
            .uri("/agents/launch")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map::class.java)
            .map { it["containerId"] as String }
    }

    fun getLeads(containerId: String): Flux<Lead> {
        return webClient.get()
            .uri("/containers/fetch-output?id=$containerId")
            .retrieve()
            .bodyToMono(Map::class.java)
            .flatMapMany { response ->
                val output = (response["output"] as String?) ?: ""
                val dataUrl = extractDataUrl(output)
                fetchLeadsFromUrl(dataUrl)
            }
    }

    private fun extractDataUrl(log: String): String {
        val regex = """✅ JSON saved at (https://[^\s]+)""".toRegex()
        return regex.find(log)?.groupValues?.get(1)
            ?: throw RuntimeException("URL de dados não encontrada")
    }

    private fun fetchLeadsFromUrl(url: String): Flux<Lead> {
        return WebClient.create()
            .get()
            .uri(url)
            .retrieve()
            .bodyToFlux(Lead::class.java)
    }
}
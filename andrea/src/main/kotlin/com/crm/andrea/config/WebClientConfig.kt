package com.crm.andrea.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class WebClientConfig {

    @Value("\${phantombuster.api.base-url}")
    private lateinit var baseUrl: String

    @Value("\${phantombuster.api.key}")
    private lateinit var apiKey: String

    @Bean
    fun phantombusterWebClient(): WebClient {
        return WebClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("X-Phantombuster-Key", apiKey)
            .build()
    }
}
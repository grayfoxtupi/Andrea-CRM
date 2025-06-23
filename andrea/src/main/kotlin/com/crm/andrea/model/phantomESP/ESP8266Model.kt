package com.crm.andrea.model.phantomESP

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "stored_mqtt_messages") //  tabel
class ESP8266Model(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,


    @Column(nullable = false, columnDefinition = "TEXT")
    val content: String = "",

    @Column(name = "sent_at", nullable = false) //
    var sentAt: LocalDateTime = LocalDateTime.now()
) {
    // Construtor padrão exigido pelo JPA
    constructor() : this(content = "")
}

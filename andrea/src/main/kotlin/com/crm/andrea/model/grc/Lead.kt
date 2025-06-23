package com.crm.andrea.model.grc

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "lead")
@JsonIgnoreProperties(value = ["hibernateLazyInitializer", "handler"])
data class Lead(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lead_id")
    var leadId: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company = Company(),

    @Column(name = "date")
    var date: LocalDate? = null,

    @Column(name = "communication_channel")
    var communicationChannel: String = "",

    @Column(name = "location")
    var location: String = "",

    @Column(name = "offer")
    var offer: String = "",

    @Column(name = "is_lead")
    var isLead: Boolean = true

) : Serializable {
    constructor(leadId: Long) : this(
        leadId = leadId,
        company = Company(),
        date = null,
        communicationChannel = "",
        location = "",
        offer = "",
        isLead = true
    )
}

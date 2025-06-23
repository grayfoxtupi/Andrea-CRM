package com.crm.andrea.model.grc

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "client")
@JsonIgnoreProperties(value = ["hibernateLazyInitializer", "handler"])
class Client(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    var clientId: Long? = null,

    @Column(name = "company_name", nullable = false)
    var companyName: String = "",

    @Column(name = "cnpj", nullable = false)
    var cnpj: String = "",

    @Column(name = "description", nullable = false)
    var description: String = "",

    @Column(name = "company_email", nullable = false)
    var companyEmail: String = "",

    @Column(name = "company_phone_number", nullable = false)
    var companyPhoneNumber: String = "",

    @Column(name = "business_area", nullable = false)
    var businessArea: String = "",

    @Column(name = "status")
    var status: String = "Ativo"

) : Serializable {
    constructor(clientId: Long) : this(
        clientId = clientId,
        companyName = "",
        cnpj = "",
        description = "",
        companyEmail = "",
        companyPhoneNumber = "",
        businessArea = "",
        status = ""
    )
}


//@Table(name = "client")
//class Client(
//    @Id
//    @GeneratedValue( strategy = GenerationType.IDENTITY)
//    @Column(name = "client_id")
//    var clientId : Long,
//
//    @Column(name = "position")
//    var position : String,
//
//    @ManyToOne
//    @JoinColumn(name = "company_id", nullable = false)
//    var companyId : Company,
//
//    @Column(name = "location")
//    var location : String,
//
//    @Column(name = "birthday_date")
//    var birthdayDate : LocalDate,
//
//    @Column(name = "client_email")
//    var clientEmail : String,
//
//    @Column(name = "client_phone_number")
//    var clientPhoneNumber : String,
//
//    @Column(name = "skype")
//    var skype : String
//
//) : Serializable
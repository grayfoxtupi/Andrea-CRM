package com.crm.andrea.model.grc


import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "company")
@JsonIgnoreProperties(value = ["hibernateLazyInitializer", "handler"])
class Company(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    var companyId: Long? = null,

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
    var businessArea: String = ""

) : Serializable {
    constructor(companyId: Long) : this(
        companyId = companyId,
        companyName = "",
        cnpj = "",
        description = "",
        companyEmail = "",
        companyPhoneNumber = "",
        businessArea = ""
    )
}



//@Entity
//@Table(name = "company")
//@JsonIgnoreProperties(value = ["hibernateLazyInitializer", "handler"])
//class Company(
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "company_id")
//    var companyId: Long? = null,
//
//    @Column(name = "company_name")
//    var companyName: String,
//
//    @Column(name = "cnpj")
//    var cnpj: String,
//
//    @Column(name = "description")
//    var description: String,
//
//    @Column(name = "company_email")
//    var companyEmail: String,
//
//    @Column(name = "company_phone_number")
//    var companyPhoneNumber: String,
//
//    @Column(name = "business_area")
//    var businessArea: String
//
//) : Serializable {
//
//    constructor() : this(
//        companyId = null,
//        companyName = "",
//        cnpj = "",
//        description = "",
//        companyEmail = "",
//        companyPhoneNumber = "",
//        businessArea = ""
//    )
//
////    constructor(companyId: Long) : this(
////        companyId = companyId,
////        companyName = "",
////        cnpj = "",
////        description = "",
////        companyEmail = "",
////        companyPhoneNumber = "",
////        businessArea = ""
////    )




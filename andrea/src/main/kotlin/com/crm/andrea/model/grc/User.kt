package com.crm.andrea.model.grc

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "andrea_user")
class AndreaUser(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid")
    var userId : Long,

    @Column(name = "name")
    var name : String,

    @Column(name = "email")
    var email : String,

    @Column(name = "password")
    var password : String

) : Serializable {

    constructor() : this(0, "João Silva", "joao@ex.com", "senhaSegura")
}
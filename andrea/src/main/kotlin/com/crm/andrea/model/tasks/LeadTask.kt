package com.crm.andrea.model.tasks

import com.crm.andrea.model.grc.Lead
import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDate

@Entity
@Table(name = "lead_task")
data class LeadTask(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lead_task_id")
    var leadTaskId: Long? = null,

    @Column(name = "contact")
    var contact: String = "",

    @Column(name = "place")
    var place: String = "",

    @Column(name = "contact_method")
    var contactMethod: String = "",

    @Column(name = "feedback")
    var feedback: String = "",

    @Column(name = "task_begin")
    var taskBegin: LocalDate = LocalDate.now(),

    @Column(name = "task_end")
    var taskEnd: LocalDate = LocalDate.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    var lead: Lead = Lead(),

    @Column(name = "task_status")
    var taskStatus: String = "Em processo"

) : Serializable

package com.crm.andrea.model.tasks

import com.crm.andrea.model.grc.Client
import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDate

@Entity
@Table(name = "client_task")
class ClientTask (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    var taskId : Long? = null,

    @Column(name = "meeting_topic")
    var meetingTopic : String = "",

    @Column(name = "task_begin")
    var taskBegin : LocalDate = LocalDate.now(),

    @Column(name = "task_end")
    var taskEnd : LocalDate = LocalDate.now(),

    @Column(name = "project_description")
    var projectDescription : String = "",

    @Column(name = "notes")
    var notes : String = "",

    @Column(name = "task_status")
    var taskStatus: String = "Em processo",


    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    var client : Client


) : Serializable
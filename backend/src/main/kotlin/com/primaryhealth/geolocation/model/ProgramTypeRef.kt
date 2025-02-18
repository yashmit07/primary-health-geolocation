package com.primaryhealth.geolocation.model

import java.time.LocalDateTime
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import jakarta.persistence.*

@Entity
@Table(
    name = "program_type_refs",
    uniqueConstraints = [
        UniqueConstraint(
            columnNames = ["program_id", "type_id"]
        )
    ]
)
data class ProgramTypeRef(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne
    @JoinColumn(name = "program_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    val program: SocialProgram,

    @ManyToOne
    @JoinColumn(name = "type_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    val programType: ProgramType,
    
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

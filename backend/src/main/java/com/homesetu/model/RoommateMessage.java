package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_messages")
public class RoommateMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long connectionId;

    @Column(nullable = false)
    private Long senderStudentId;

    private String senderName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private Boolean isRead = false;

    private LocalDateTime sentAt = LocalDateTime.now();

    public RoommateMessage() {}

    public RoommateMessage(Long connectionId, Long senderStudentId, String senderName, String content) {
        this.connectionId = connectionId;
        this.senderStudentId = senderStudentId;
        this.senderName = senderName;
        this.content = content;
        this.sentAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public Long getSenderStudentId() { return senderStudentId; }
    public void setSenderStudentId(Long senderStudentId) { this.senderStudentId = senderStudentId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}

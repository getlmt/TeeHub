package com.example.backend.DTO.Response;

import com.example.backend.Entity.SiteUser;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class ChatRoomResponse {
    private Integer roomId;
    private SiteUser user;
    private String lastMessage;      // Nội dung tin cuối
    private Date lastMessageTime;    // Thời gian tin cuối
    private boolean isRead;          // Đã đọc hay chưa
    private long unreadCount;

    public ChatRoomResponse(Integer roomId, SiteUser user, String lastMessage, Date lastMessageTime, long unreadCount) {
        this.roomId = roomId;
        this.user = user;
        this.lastMessage = lastMessage != null ? lastMessage : "Chưa có tin nhắn";
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
    }
}

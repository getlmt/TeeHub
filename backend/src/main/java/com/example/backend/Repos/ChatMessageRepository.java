package com.example.backend.Repos;

import com.example.backend.Entity.ChatMessage;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findByChatRoom_RoomIdOrderByTimestampAsc(Integer roomId);
    ChatMessage findFirstByChatRoom_RoomIdOrderByTimestampDesc(Integer roomId);

    long countByChatRoom_RoomIdAndSender_RoleAndIsReadFalse(Integer roomId, String role);
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom.roomId = :roomId AND m.sender.role = 'USER'")
    void markMessagesAsRead(@Param("roomId") Integer roomId);
}

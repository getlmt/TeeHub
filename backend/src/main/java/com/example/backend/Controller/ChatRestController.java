package com.example.backend.Controller;

import com.example.backend.DTO.Response.ChatRoomResponse;
import com.example.backend.Entity.ChatMessage;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    // 1. API: Lấy (hoặc tạo) phòng chat cho User
    // GET /api/chat/room?userId=1
    @GetMapping("/room")
    public ResponseEntity<ChatRoom> getRoom(@RequestParam Integer userId) {
        return ResponseEntity.ok(chatService.getOrCreateRoom(userId));
    }

    // 2. API: Lấy lịch sử tin nhắn
    // GET /api/chat/history/1 (1 là roomId)
    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Integer roomId) {
        return ResponseEntity.ok(chatService.getChatHistory(roomId));
    }

    // 3. API: Gửi tin nhắn (TEST ONLY - Thực tế dùng WebSocket)
    // POST /api/chat/send
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendTestMessage(@RequestBody TestMessageRequest request) {
        return ResponseEntity.ok(chatService.saveMessage(
                request.roomId,
                request.senderId,
                request.content
        ));
    }

    // Class DTO nhỏ để hứng dữ liệu test
    public static class TestMessageRequest {
        public Integer roomId;
        public Integer senderId;
        public String content;
    }
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getAllRooms() { // Sửa kiểu trả về
        return ResponseEntity.ok(chatService.getAllRooms());
    }
    @PutMapping("/read/{roomId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer roomId) {
        chatService.markAsRead(roomId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer roomId) {
        chatService.deleteRoom(roomId);
        return ResponseEntity.ok().build();
    }
}
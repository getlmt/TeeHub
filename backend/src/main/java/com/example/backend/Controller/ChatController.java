package com.example.backend.Controller;

import com.example.backend.Entity.ChatMessage;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.ChatRoomRepository;
import com.example.backend.Repos.ChatMessageRepository;
import com.example.backend.Repos.ChatRoomRepository;
import com.example.backend.Repos.ChatRoomRepository;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Dùng để gửi tin nhắn về lại React

    @Autowired
    private ChatMessageRepository messageRepo;

    @Autowired
    private ChatRoomRepository roomRepo;

    @Autowired
    private SiteUserRepo userRepo;


    @MessageMapping("/chat.sendMessage/{roomId}")
    @Transactional
    public void sendMessage(@DestinationVariable Integer roomId, @Payload Map<String, Object> payload) {
        System.out.println(">>> ChatController: Đang nhận tin nhắn từ Room: " + roomId);
        System.out.println(">>> Payload: " + payload);
        // 1. Lấy dữ liệu từ payload (JSON gửi lên)
        String content = (String) payload.get("content");
        Integer senderId = Integer.parseInt(payload.get("senderId").toString());

        // 2. Tìm Room và User
        ChatRoom room = roomRepo.findById(roomId).orElseThrow();
        SiteUser sender = userRepo.findById(senderId).orElseThrow();

        // 3. Lưu vào DB
        ChatMessage message = new ChatMessage();
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(content);
        message.setTimestamp(new Date());
        ChatMessage savedMsg = messageRepo.save(message);

        System.out.println(">>> Đã lưu tin nhắn ID: " + savedMsg.getMessageId());

        // === SỬA ĐOẠN TẠO RESPONSE NÀY ===
        // Thay vì Map.of (không nhận null), hãy dùng HashMap
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("messageId", savedMsg.getMessageId());
        response.put("content", savedMsg.getContent());
        response.put("senderId", sender.getUserId());

        // Xử lý null cho tên (nếu null thì lấy email hoặc "Unknown")
        String displayName = sender.getFullName();
        if (displayName == null || displayName.isEmpty()) {
            displayName = sender.getEmailAddress();
        }
        response.put("senderName", displayName);

        response.put("timestamp", savedMsg.getTimestamp());

        // Thêm thông tin sender object đầy đủ nếu cần (để frontend check ID)
        Map<String, Object> senderObj = new java.util.HashMap<>();
        senderObj.put("userId", sender.getUserId());
        senderObj.put("id", sender.getUserId()); // Phòng hờ frontend dùng .id
        response.put("sender", senderObj);
        // =================================

        messagingTemplate.convertAndSend("/topic/room/" + roomId, response);


    }
}
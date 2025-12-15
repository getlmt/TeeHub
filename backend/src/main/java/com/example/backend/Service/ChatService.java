package com.example.backend.Service;

import com.example.backend.DTO.Response.ChatRoomResponse;
import com.example.backend.Entity.ChatMessage;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.ChatMessageRepository;
import com.example.backend.Repos.ChatRoomRepository;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository roomRepo;

    @Autowired
    private ChatMessageRepository messageRepo;

    @Autowired
    private SiteUserRepo userRepo;


    public ChatRoom getOrCreateRoom(Integer userId) {
        // 1. Tìm xem user này đã có phòng chat chưa
        return roomRepo.findByUser_Id(userId)
                .orElseGet(() -> {
                    // 2. Nếu chưa có (orElseGet), tạo mới
                    ChatRoom newRoom = new ChatRoom();
                    SiteUser user = userRepo.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    newRoom.setUser(user);
                    return roomRepo.save(newRoom);
                });
    }


    public List<ChatMessage> getChatHistory(Integer roomId) {
        return messageRepo.findByChatRoom_RoomIdOrderByTimestampAsc(roomId);
    }


    public ChatMessage saveMessage(Integer roomId, Integer senderId, String content) {
        ChatRoom room = roomRepo.findById(roomId).orElseThrow();
        SiteUser sender = userRepo.findById(senderId).orElseThrow();

        ChatMessage message = new ChatMessage();
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(content);

        return messageRepo.save(message);
    }
    public List<ChatRoomResponse> getAllRooms() {
        List<ChatRoom> rooms = roomRepo.findAll();
        List<ChatRoomResponse> responseList = new ArrayList<>();

        for (ChatRoom room : rooms) {
            // Lấy tin nhắn cuối cùng của phòng này
            ChatMessage lastMsg = messageRepo.findFirstByChatRoom_RoomIdOrderByTimestampDesc(room.getRoomId());

            String content = (lastMsg != null) ? lastMsg.getContent() : null;
            Date time = (lastMsg != null) ? lastMsg.getTimestamp() : null;

            // === ĐẾM SỐ TIN CHƯA ĐỌC CỦA USER ===
            long unread = messageRepo.countByChatRoom_RoomIdAndSender_RoleAndIsReadFalse(room.getRoomId(), "USER");


            // Tạo DTO
            responseList.add(new ChatRoomResponse(
                    room.getRoomId(),
                    room.getUser(),
                    content,
                    time,
                    unread
            ));
        }

        // Sắp xếp: Phòng có tin nhắn mới nhất lên đầu
        responseList.sort((a, b) -> {
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime());
        });

        return responseList;
    }
    public void markAsRead(Integer roomId) {
        messageRepo.markMessagesAsRead(roomId);
    }
    public void deleteRoom(Integer roomId) {


        roomRepo.deleteById(roomId);
    }
}
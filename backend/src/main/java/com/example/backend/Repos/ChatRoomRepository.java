package com.example.backend.Repos;

import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    // Tìm phòng chat dựa trên User (để xem user này đã có phòng chưa)
    Optional<ChatRoom> findByUser(SiteUser user);

    // Tìm theo userId
    Optional<ChatRoom> findByUser_Id(Integer userId);}

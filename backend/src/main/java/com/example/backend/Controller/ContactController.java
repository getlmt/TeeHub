package com.example.backend.Controller;
import com.example.backend.DTO.Request.ContactRequest;
import com.example.backend.DTO.Response.ContactMessageResponse;
import com.example.backend.Entity.ContactMessage;
import com.example.backend.Service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    @Autowired
    private ContactService contactService;


    @PostMapping
    public ResponseEntity<String> submitContactForm(
            @Valid @RequestBody ContactRequest request,
            Principal principal // (Tùy chọn, có thể null nếu là khách)
    ) {
        contactService.saveMessage(request, principal);
        return ResponseEntity.ok("Tin nhắn của bạn đã được gửi thành công.");
    }
    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> getAllMessages() {
        List<ContactMessageResponse> messages = contactService.getAllMessages();
        return ResponseEntity.ok(messages);
    }
}

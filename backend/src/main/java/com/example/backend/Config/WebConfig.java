package com.example.backend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.avatar.dir}")
    private String avatarDir;

    @Value("${app.custom.dir}")
    private String customDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:///" + avatarDir + "/")
                .setCachePeriod(3600)  // optional: cache 1h
                .resourceChain(true);
        registry.addResourceHandler("/CustomProduct/**")
                .addResourceLocations("file:///" + customDir + "/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}

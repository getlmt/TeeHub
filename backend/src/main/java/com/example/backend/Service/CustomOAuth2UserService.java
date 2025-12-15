package com.example.backend.Service;

import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import com.example.backend.Sercurity.UserPrincipal;
import com.example.backend.Exception.OAuth2AuthenticationProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private SiteUserRepo siteUserRepo;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");


        if (!StringUtils.hasText(email)) {

            Object idObj = oAuth2User.getAttribute("id");
            String providerId = null;

            if (idObj != null) {
                providerId = String.valueOf(idObj);
            }

            if (providerId == null) {
                providerId = oAuth2User.getAttribute("sub");
            }

            email = providerId + "@" + userRequest.getClientRegistration().getRegistrationId() + ".com";
        }

        Optional<SiteUser> userOptional = siteUserRepo.findByEmailAddress(email);

        SiteUser user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user = updateExistingUser(user, oAuth2User);
        } else {
            user = registerNewUser(userRequest, oAuth2User, email);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private SiteUser registerNewUser(OAuth2UserRequest userRequest, OAuth2User oAuth2User, String email) {
        SiteUser user = new SiteUser();

        String name = oAuth2User.getAttribute("name");
        if (name == null) {
            name = oAuth2User.getAttribute("login");
        }
        user.setFullName(name);

        user.setEmailAddress(email);

        String avatarUrl = null;
        if (oAuth2User.getAttributes().containsKey("picture")) {
            Object pic = oAuth2User.getAttribute("picture");
            if (pic instanceof String) {
                avatarUrl = (String) pic;
            }
        } else if (oAuth2User.getAttributes().containsKey("avatar_url")) {
            avatarUrl = oAuth2User.getAttribute("avatar_url");
        }
        user.setUserAvatar(avatarUrl);

        user.setRole("USER");

        user.setPassword(UUID.randomUUID().toString());

        user.setPhoneNumber("");

        return siteUserRepo.save(user);
    }

    private SiteUser updateExistingUser(SiteUser existingUser, OAuth2User oAuth2User) {
        String name = oAuth2User.getAttribute("name");
        if (name == null) {
            name = oAuth2User.getAttribute("login");
        }
        if (name != null) {
            existingUser.setFullName(name);
        }

        if (oAuth2User.getAttributes().containsKey("picture")) {
            Object pic = oAuth2User.getAttribute("picture");
            if (pic instanceof String) {
                existingUser.setUserAvatar((String) pic);
            }
        } else if (oAuth2User.getAttributes().containsKey("avatar_url")) {
            existingUser.setUserAvatar(oAuth2User.getAttribute("avatar_url"));
        }

        return siteUserRepo.save(existingUser);
    }
}
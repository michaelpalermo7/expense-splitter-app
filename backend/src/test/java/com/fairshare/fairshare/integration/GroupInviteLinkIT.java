package com.fairshare.fairshare.integration;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fairshare.fairshare.dto.GroupDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureMockMvc
class GroupInviteLinkIT {

    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    record CreateGroupRequest(String groupName) {
    }

    @Test
    void inviteLink_create_resolve_get_rotate_404_and_delete_by_token() throws Exception {
        String createBody = objectMapper.writeValueAsString(new CreateGroupRequest("Trip"));
        String createResp = mockMvc.perform(
                post("/group")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        GroupDTO group = objectMapper.readValue(createResp, GroupDTO.class);
        Long groupId = group.groupId();
        String token1 = group.inviteToken();

        assertThat(groupId).isNotNull();
        assertThat(token1).isNotBlank();
        assertThat(token1.length()).isLessThanOrEqualTo(64);
        assertThat(token1).matches("^[A-Za-z0-9_-]+$");

        String resolveResp = mockMvc.perform(get("/group/{token}", token1))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        GroupDTO resolved = objectMapper.readValue(resolveResp, GroupDTO.class);
        assertThat(resolved.groupId()).isEqualTo(groupId);
        assertThat(resolved.groupName()).isEqualTo("Trip");
        Instant createdAt = resolved.groupCreatedAt();
        assertThat(createdAt).isNotNull();

        String gotToken = mockMvc.perform(get("/group/{token}/link", token1))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(gotToken).isEqualTo(token1);

        String token2 = mockMvc.perform(post("/group/{token}/link/rotate", token1))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(token2).isNotBlank();
        assertThat(token2).matches("^[A-Za-z0-9_-]+$");
        assertThat(token2).isNotEqualTo(token1);

        String resolve2 = mockMvc.perform(get("/group/{token}", token2))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        GroupDTO resolved2 = objectMapper.readValue(resolve2, GroupDTO.class);
        assertThat(resolved2.groupId()).isEqualTo(groupId);

        mockMvc.perform(get("/group/{token}", token1))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/group/{token}", "thisTokenDoesNotExist"))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/group/{token}", token2))
                .andExpect(status().isNoContent());
    }
}

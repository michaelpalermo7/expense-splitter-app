package com.fairshare.fairshare.dto;

import java.time.Instant;

public record GroupDTO(
                Long groupId,
                String groupName,
                Instant groupCreatedAt,
                String inviteToken) {
}

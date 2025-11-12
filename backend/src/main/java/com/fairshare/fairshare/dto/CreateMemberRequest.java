package com.fairshare.fairshare.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateMemberRequest(
        @NotEmpty @Size(min = 1) String[] names) {
}

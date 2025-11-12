package com.fairshare.fairshare.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fairshare.fairshare.dto.AddMemberRequest;
import com.fairshare.fairshare.dto.CreateGroupRequest;
import com.fairshare.fairshare.dto.CreateMemberRequest;
import com.fairshare.fairshare.dto.GroupDTO;
import com.fairshare.fairshare.dto.MembershipDTO;
import com.fairshare.fairshare.service.GroupService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@Validated
@RestController
@RequestMapping("/api/group")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    private Long groupIdFromToken(String token) throws NotFoundException {
        return groupService.findByInviteToken(token).groupId();
    }

    @PostMapping
    public GroupDTO createGroup(@RequestBody @Valid CreateGroupRequest request) {
        return groupService.createGroup(request.groupName());
    }

    @GetMapping("/{token}")
    public GroupDTO getGroupByToken(@PathVariable String token) throws NotFoundException {
        return groupService.findByInviteToken(token);
    }

    @DeleteMapping("/{token}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable String token)
            throws NotFoundException, AccessDeniedException {
        groupService.deleteGroup(groupIdFromToken(token));
    }

    @GetMapping("/{token}/members")
    public List<MembershipDTO> listAllMembers(@PathVariable String token) throws NotFoundException {
        return groupService.listAllMembers(groupIdFromToken(token));
    }

    @PostMapping("/{token}/members")
    public MembershipDTO addMember(
            @PathVariable String token,
            @RequestBody @Valid AddMemberRequest request) throws NotFoundException {
        return groupService.addMemberByName(groupIdFromToken(token), request.displayName());
    }

    @PostMapping("/{token}/members/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public List<MembershipDTO> addMembersBulk(
            @PathVariable String token,
            @RequestBody @Valid CreateMemberRequest request) throws NotFoundException {
        return groupService.addMembersByNames(groupIdFromToken(token),
                java.util.Arrays.asList(request.names()));
    }

    @DeleteMapping("/{token}/members/{membershipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable String token,
            @PathVariable Long membershipId)
            throws NotFoundException, AccessDeniedException {
        groupService.removeMember(membershipId, groupIdFromToken(token));
    }

    @GetMapping("/{token}/link")
    public String getInviteLink(@PathVariable String token) throws NotFoundException {
        // same token is the invite link
        groupService.findByInviteToken(token);
        return token;
    }

    @PostMapping("/{token}/link/rotate")
    public String rotateInviteLink(@PathVariable String token) throws NotFoundException {
        return groupService.rotateInviteLink(groupIdFromToken(token));
    }
}

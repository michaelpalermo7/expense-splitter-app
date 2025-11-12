package com.fairshare.fairshare.service;

import java.nio.file.AccessDeniedException;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fairshare.fairshare.dto.GroupDTO;
import com.fairshare.fairshare.dto.MembershipDTO;
import com.fairshare.fairshare.entity.Group;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.util.TokenGenerator;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final MembershipRepository membershipRepository;

    public GroupService(GroupRepository groupRepository,
            MembershipRepository membershipRepository) {
        this.groupRepository = groupRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public GroupDTO createGroup(String groupName) {
        Group g = new Group();
        g.setGroupName(groupName);
        g.setInviteToken(TokenGenerator.newInviteToken());
        Group saved = groupRepository.save(g);

        return new GroupDTO(saved.getGroupId(), saved.getGroupName(), saved.getGroupCreatedAt(), g.getInviteToken());
    }

    @Transactional(readOnly = true)
    public String getInviteLink(Long groupId) throws NotFoundException {
        Group g = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        return g.getInviteToken();
    }

    @Transactional
    public String rotateInviteLink(Long groupId) throws NotFoundException {
        Group g = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        g.setInviteToken(TokenGenerator.newInviteToken());
        groupRepository.save(g);
        return g.getInviteToken();
    }

    @Transactional(readOnly = true)
    public GroupDTO findByInviteToken(String token) throws NotFoundException {
        Group g = groupRepository.findByInviteToken(token).orElseThrow(NotFoundException::new);
        return new GroupDTO(g.getGroupId(), g.getGroupName(), g.getGroupCreatedAt(), g.getInviteToken());
    }

    @Transactional
    public com.fairshare.fairshare.dto.MembershipDTO addMemberByName(Long groupId, String displayName)
            throws NotFoundException, IllegalArgumentException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        if (membershipRepository.existsByGroup_GroupIdAndDisplayNameIgnoreCase(groupId, displayName)) {
            throw new IllegalArgumentException("A member with that name already exists in this group.");
        }
        Membership m = new Membership();
        m.setGroup(group);
        m.setDisplayName(displayName.trim());
        Membership saved = membershipRepository.save(m);
        return new MembershipDTO(saved.getMembershipId(), saved.getGroup().getGroupId(), saved.getDisplayName());
    }

    @Transactional
    public java.util.List<MembershipDTO> addMembersByNames(Long groupId, java.util.List<String> rawNames)
            throws NotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        java.util.Set<String> seen = new java.util.HashSet<>();
        java.util.List<String> names = rawNames.stream()
                .map(n -> n == null ? "" : n.trim())
                .filter(n -> !n.isBlank())
                .filter(n -> seen.add(n.toLowerCase()))
                .toList();
        java.util.List<MembershipDTO> created = new java.util.ArrayList<>(names.size());
        for (String name : names) {
            if (membershipRepository.existsByGroup_GroupIdAndDisplayNameIgnoreCase(groupId, name))
                continue;
            Membership m = new Membership();
            m.setGroup(group);
            m.setDisplayName(name);
            Membership saved = membershipRepository.save(m);
            created.add(
                    new MembershipDTO(saved.getMembershipId(), saved.getGroup().getGroupId(), saved.getDisplayName()));
        }
        return created;
    }

    @Transactional
    public void removeMember(Long membershipId, Long groupId)
            throws NotFoundException, AccessDeniedException {
        groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        Membership target = membershipRepository.findById(membershipId).orElseThrow(NotFoundException::new);
        if (!target.getGroup().getGroupId().equals(groupId)) {
            throw new AccessDeniedException("Membership does not belong to this group.");
        }
        membershipRepository.delete(target);
    }

    @Transactional(readOnly = true)
    public java.util.List<MembershipDTO> listAllMembers(Long groupId) throws NotFoundException {
        if (!groupRepository.existsById(groupId))
            throw new NotFoundException();
        return membershipRepository.findByGroup_GroupId(groupId).stream()
                .map(m -> new MembershipDTO(m.getMembershipId(), m.getGroup().getGroupId(), m.getDisplayName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public GroupDTO getGroupById(Long groupId) throws NotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        return new GroupDTO(group.getGroupId(), group.getGroupName(), group.getGroupCreatedAt(),
                group.getInviteToken());
    }

    @Transactional
    public void deleteGroup(Long groupId) throws NotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        groupRepository.delete(group);
    }

    @Transactional(readOnly = true)
    public java.util.List<GroupDTO> listAllGroups() {
        return groupRepository.findAll().stream()
                .map(g -> new GroupDTO(g.getGroupId(), g.getGroupName(), g.getGroupCreatedAt(), g.getInviteToken()))
                .toList();
    }
}

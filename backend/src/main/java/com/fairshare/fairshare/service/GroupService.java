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

    /**
     * Creates a new group with the given name.
     * 
     * @param groupName the name of the group to be created
     * @return the created group represented as a {@link GroupDTO}
     */
    @Transactional
    public GroupDTO createGroup(String groupName) {
        Group g = new Group();
        g.setGroupName(groupName);
        g.setInviteToken(TokenGenerator.newInviteToken());
        Group saved = groupRepository.save(g);

        return new GroupDTO(saved.getGroupId(), saved.getGroupName(), saved.getGroupCreatedAt(), g.getInviteToken());
    }

    /**
     * Retrieves the invite token for a given group.
     * 
     * @param groupId the ID of the group whose invite token is being retrieved
     * @return the invite token associated with the group
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public String getInviteLink(Long groupId) throws NotFoundException {
        Group g = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);

        return g.getInviteToken();
    }

    /**
     * Rotates the invite token for a given group by generating a new one.
     * 
     * @param groupId the ID of the group whose invite token is being rotated
     * @return the newly generated invite token
     * @throws NotFoundException if the group does not exist
     */
    @Transactional
    public String rotateInviteLink(Long groupId) throws NotFoundException {
        Group g = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);

        g.setInviteToken(TokenGenerator.newInviteToken());
        groupRepository.save(g);

        return g.getInviteToken();
    }

    /**
     * Retrieves a group by its invite token.
     * 
     * @param token the invite token associated with the group
     * @return the group represented as a {@link GroupDTO}
     * @throws NotFoundException if no group is found for the given invite token
     */
    @Transactional(readOnly = true)
    public GroupDTO findByInviteToken(String token) throws NotFoundException {
        Group g = groupRepository.findByInviteToken(token).orElseThrow(NotFoundException::new);

        return new GroupDTO(g.getGroupId(), g.getGroupName(), g.getGroupCreatedAt(), g.getInviteToken());
    }

    /**
     * Adds a new member to a group using a display name.
     * 
     * @param groupId     the ID of the group to which the member is being added
     * @param displayName the display name of the new member; must be unique within
     *                    the group
     * @return the created member represented as a {@link MembershipDTO}
     * @throws NotFoundException        if the group does not exist
     * @throws IllegalArgumentException if a member with the same display name
     *                                  already exists in the group
     */
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

    /**
     * Adds multiple members to a group using a list of display names.
     * 
     * @param groupId  the ID of the group to which members are being added
     * @param rawNames the list of raw display names to add
     * @return a list of {@link MembershipDTO} objects representing the members
     *         that were successfully created
     * @throws NotFoundException if the group does not exist
     */
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

    /**
     * Removes a member from a group.
     *
     * @param membershipId the ID of the membership to be removed
     * @param groupId      the ID of the group from which the member is being
     *                     removed
     * @throws NotFoundException     if the group or membership does not exist
     * @throws AccessDeniedException if the membership does not belong to the group
     */
    @Transactional
    public void removeMember(Long membershipId, Long groupId)
            throws NotFoundException, AccessDeniedException {
        groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        Membership target = membershipRepository.findById(membershipId).orElseThrow(NotFoundException::new);

        if (!target.getGroup().getGroupId().equals(groupId)) {
            throw new AccessDeniedException("Membership does not belong to this group.");
        }

        long memberCount = membershipRepository.countByGroup_GroupId(groupId);
        if (memberCount <= 1) {
            throw new IllegalArgumentException("Cannot remove the last member of a group.");
        }

        membershipRepository.delete(target);
    }

    /**
     * Retrieves all members of a given group.
     *
     * @param groupId the ID of the group whose members are being retrieved
     * @return a list of {@link MembershipDTO} objects representing the group's
     *         members
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public java.util.List<MembershipDTO> listAllMembers(Long groupId) throws NotFoundException {

        if (!groupRepository.existsById(groupId))
            throw new NotFoundException();

        return membershipRepository.findByGroup_GroupId(groupId).stream()
                .map(m -> new MembershipDTO(m.getMembershipId(), m.getGroup().getGroupId(), m.getDisplayName()))
                .toList();
    }

    /**
     * Retrieves a group by its ID.
     *
     * @param groupId the ID of the group to retrieve
     * @return the group represented as a {@link GroupDTO}
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public GroupDTO getGroupById(Long groupId) throws NotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);

        return new GroupDTO(group.getGroupId(), group.getGroupName(), group.getGroupCreatedAt(),
                group.getInviteToken());
    }

    /**
     * Deletes a group by its ID.
     *
     * @param groupId the ID of the group to be deleted
     * @throws NotFoundException if the group does not exist
     */
    @Transactional
    public void deleteGroup(Long groupId) throws NotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(NotFoundException::new);
        groupRepository.delete(group);
    }

}

package com.fairshare.fairshare.services;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;

import com.fairshare.fairshare.dto.GroupDTO;
import com.fairshare.fairshare.dto.MembershipDTO;
import com.fairshare.fairshare.entity.Group;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.service.GroupService;

@ExtendWith(MockitoExtension.class)
public class GroupServiceTest {

        @Mock
        GroupRepository groupRepository;
        @Mock
        MembershipRepository membershipRepository;

        @InjectMocks
        GroupService groupService;

        private static Group group(long id, String name) {
                Group g = new Group();
                g.setGroupId(id);
                g.setGroupName(name);
                return g;
        }

        private static Membership member(long id, String name, Group g) {
                Membership m = new Membership();
                m.setMembershipId(id);
                m.setDisplayName(name);
                m.setGroup(g);
                return m;
        }

        @Test
        void createGroup_createsAndReturnsDTO() {
                String name = "Lunch";
                Group saved = group(1L, name);
                when(groupRepository.save(any(Group.class))).thenReturn(saved);

                GroupDTO dto = groupService.createGroup(name);

                assertEquals(1L, dto.groupId());
                assertEquals("Lunch", dto.groupName());
                verify(groupRepository).save(argThat(g -> "Lunch".equals(g.getGroupName())));
        }

        @Test
        void removeMember_whenMembershipNotInGroup_throwsAccessDenied() throws Exception {
                Long groupId = 1L;
                Long membershipId = 10L;

                Group g1 = group(groupId, "Trip");
                Group g2 = group(2L, "Other");
                Membership m = member(membershipId, "Alice", g2);

                when(groupRepository.findById(groupId)).thenReturn(Optional.of(g1));
                when(membershipRepository.findById(membershipId)).thenReturn(Optional.of(m));

                assertThrows(java.nio.file.AccessDeniedException.class,
                                () -> groupService.removeMember(membershipId, groupId));

                verify(membershipRepository, never()).delete(any());
        }

        @Test
        void deleteGroup_whenGroupExists_deletes() throws Exception {
                Long groupId = 1L;
                Group g = group(groupId, "Club");
                when(groupRepository.findById(groupId)).thenReturn(Optional.of(g));

                groupService.deleteGroup(groupId);

                verify(groupRepository).delete(g);
        }

        @Test
        void addMemberByName_whenDuplicateName_throwsIllegalArgument() throws Exception {
                Long groupId = 1L;
                String name = "Alice";

                when(groupRepository.findById(groupId)).thenReturn(Optional.of(group(groupId, "Team")));
                when(membershipRepository.existsByGroup_GroupIdAndDisplayNameIgnoreCase(groupId, name))
                                .thenReturn(true);

                assertThrows(IllegalArgumentException.class,
                                () -> groupService.addMemberByName(groupId, name));

                verify(membershipRepository, never()).save(any());
        }

        @Test
        void addMembersByNames_bulk_createsOnlyNewUniqueNames() throws Exception {
                Long groupId = 1L;
                Group g = group(groupId, "Party");
                when(groupRepository.findById(groupId)).thenReturn(Optional.of(g));

                when(membershipRepository.existsByGroup_GroupIdAndDisplayNameIgnoreCase(groupId, "Alice"))
                                .thenReturn(true);
                when(membershipRepository.existsByGroup_GroupIdAndDisplayNameIgnoreCase(groupId, "Bob"))
                                .thenReturn(false);

                when(membershipRepository.save(any(Membership.class))).thenAnswer(inv -> {
                        Membership m = inv.getArgument(0);
                        if ("Bob".equals(m.getDisplayName()))
                                m.setMembershipId(200L);
                        return m;
                });

                List<MembershipDTO> created = groupService.addMembersByNames(groupId,
                                List.of("Alice", "Bob", "alice", "  Bob  "));

                assertEquals(1, created.size());
                assertEquals(200L, created.get(0).membershipId());
                assertEquals("Bob", created.get(0).displayName());
        }

        @Test
        void listAllMembers_whenGroupMissing_throwsNotFound() {
                Long groupId = 99L;
                when(groupRepository.existsById(groupId)).thenReturn(false);
                assertThrows(NotFoundException.class, () -> groupService.listAllMembers(groupId));
        }

        @Test
        void createGroup_generatesInviteToken() {
                String name = "Lunch";
                // the service sets inviteToken before save; we return the same entity to keep
                // fields
                when(groupRepository.save(any(Group.class))).thenAnswer(inv -> inv.getArgument(0));

                GroupDTO dto = groupService.createGroup(name);

                // capture the saved entity to inspect token
                verify(groupRepository).save(argThat(g -> {
                        String t = g.getInviteToken();
                        assertNotNull(t, "inviteToken should be set");
                        assertTrue(!t.isBlank(), "inviteToken should not be blank");
                        assertTrue(t.length() <= 64, "inviteToken should be <= 64 chars");
                        // url-safe base64: letters, digits, - and _
                        assertTrue(t.matches("^[A-Za-z0-9_-]+$"), "inviteToken must be URL-safe");
                        return "Lunch".equals(g.getGroupName());
                }));

                // basic DTO assertions still hold
                assertEquals("Lunch", dto.groupName());
        }

        @Test
        void getInviteLink_returnsPersistedToken() throws NotFoundException {
                Group g = group(1L, "Trip");
                g.setInviteToken("abcDEF123_-");
                when(groupRepository.findById(1L)).thenReturn(Optional.of(g));

                String token = groupService.getInviteLink(1L);

                assertEquals("abcDEF123_-", token);
        }

        @Test
        void findByInviteToken_resolvesGroup_andThrowsOnMissing() throws NotFoundException {
                Group g = group(42L, "Hike");
                g.setInviteToken("tokenXYZ");
                when(groupRepository.findByInviteToken("tokenXYZ")).thenReturn(Optional.of(g));
                when(groupRepository.findByInviteToken("nope")).thenReturn(Optional.empty());

                GroupDTO ok = groupService.findByInviteToken("tokenXYZ");
                assertEquals(42L, ok.groupId());
                assertEquals("Hike", ok.groupName());

                assertThrows(NotFoundException.class, () -> groupService.findByInviteToken("nope"));
        }
}

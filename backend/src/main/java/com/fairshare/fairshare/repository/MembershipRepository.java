package com.fairshare.fairshare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fairshare.fairshare.entity.Membership;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    Optional<Membership> findByDisplayNameIgnoreCaseAndGroup_GroupId(String displayName, Long groupId);

    boolean existsByGroup_GroupIdAndDisplayNameIgnoreCase(Long groupId, String displayName);

    List<Membership> findByGroup_GroupId(Long groupId);
}

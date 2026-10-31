package com.homesetu.repository;

import com.homesetu.model.RoommateMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoommateMessageRepository extends JpaRepository<RoommateMessage, Long> {
    List<RoommateMessage> findByConnectionIdOrderBySentAtAsc(Long connectionId);
}


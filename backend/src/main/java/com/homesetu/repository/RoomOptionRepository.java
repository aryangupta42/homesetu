package com.homesetu.repository;

import com.homesetu.model.RoomOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomOptionRepository extends JpaRepository<RoomOption, Long> {
    List<RoomOption> findByPgListingId(Long pgListingId);
    void deleteByPgListingId(Long pgListingId);
}

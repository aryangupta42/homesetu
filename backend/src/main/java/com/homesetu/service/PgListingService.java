package com.homesetu.service;

import com.homesetu.model.PgListing;
import com.homesetu.model.RoomOption;
import com.homesetu.repository.PgListingRepository;
import com.homesetu.repository.RoomOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PgListingService {

    @Autowired
    private PgListingRepository pgListingRepository;

    @Autowired
    private RoomOptionRepository roomOptionRepository;

    public List<PgListing> searchListings(
            String city,
            String locality,
            String query,
            Double maxRent,
            String genderType,
            Boolean hasAc,
            Boolean hasWifi,
            Boolean foodIncluded,
            Boolean isVerified,
            String sortBy
    ) {
        List<PgListing> list = pgListingRepository.findAll();

        return list.stream()
                .filter(pg -> {
                    if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
                        if (pg.getCity() == null || !pg.getCity().equalsIgnoreCase(city.trim())) return false;
                    }
                    if (locality != null && !locality.trim().isEmpty() && !locality.equalsIgnoreCase("all")) {
                        if (pg.getLocality() == null || !pg.getLocality().equalsIgnoreCase(locality.trim())) return false;
                    }
                    if (query != null && !query.trim().isEmpty()) {
                        String q = query.toLowerCase();
                        boolean matchName = pg.getName() != null && pg.getName().toLowerCase().contains(q);
                        boolean matchLoc = pg.getLocality() != null && pg.getLocality().toLowerCase().contains(q);
                        boolean matchCity = pg.getCity() != null && pg.getCity().toLowerCase().contains(q);
                        boolean matchColleges = pg.getNearbyColleges() != null && pg.getNearbyColleges().toLowerCase().contains(q);
                        if (!matchName && !matchLoc && !matchCity && !matchColleges) return false;
                    }
                    if (maxRent != null && maxRent > 0) {
                        if (pg.getMonthlyRent() != null && pg.getMonthlyRent() > maxRent) return false;
                    }
                    if (genderType != null && !genderType.trim().isEmpty() && !genderType.equalsIgnoreCase("all")) {
                        if (pg.getGenderType() == null || !pg.getGenderType().equalsIgnoreCase(genderType.trim())) return false;
                    }
                    if (hasAc != null && hasAc) {
                        if (pg.getHasAc() == null || !pg.getHasAc()) return false;
                    }
                    if (hasWifi != null && hasWifi) {
                        if (pg.getHasWifi() == null || !pg.getHasWifi()) return false;
                    }
                    if (foodIncluded != null && foodIncluded) {
                        if (pg.getFoodIncluded() == null || !pg.getFoodIncluded()) return false;
                    }
                    if (isVerified != null && isVerified) {
                        if (pg.getIsVerified() == null || !pg.getIsVerified()) return false;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    if ("price_asc".equalsIgnoreCase(sortBy)) {
                        return Double.compare(a.getMonthlyRent() != null ? a.getMonthlyRent() : 0, b.getMonthlyRent() != null ? b.getMonthlyRent() : 0);
                    } else if ("price_desc".equalsIgnoreCase(sortBy)) {
                        return Double.compare(b.getMonthlyRent() != null ? b.getMonthlyRent() : 0, a.getMonthlyRent() != null ? a.getMonthlyRent() : 0);
                    } else if ("rating_desc".equalsIgnoreCase(sortBy)) {
                        return Double.compare(b.getRating() != null ? b.getRating() : 0, a.getRating() != null ? a.getRating() : 0);
                    }
                    return Long.compare(b.getId(), a.getId()); // newest first
                })
                .collect(Collectors.toList());
    }

    public Optional<PgListing> getById(Long id) {
        return pgListingRepository.findById(id);
    }

    public List<PgListing> getByOwnerId(Long ownerId) {
        return pgListingRepository.findByOwnerId(ownerId);
    }

    public PgListing saveListing(PgListing listing) {
        return pgListingRepository.save(listing);
    }

    @Transactional
    public void deleteListing(Long id) {
        roomOptionRepository.deleteByPgListingId(id);
        pgListingRepository.deleteById(id);
    }

    public PgListing toggleVerification(Long id) {
        Optional<PgListing> opt = pgListingRepository.findById(id);
        if (opt.isPresent()) {
            PgListing pg = opt.get();
            pg.setIsVerified(!Boolean.TRUE.equals(pg.getIsVerified()));
            return pgListingRepository.save(pg);
        }
        return null;
    }

    public List<RoomOption> getRoomsForPg(Long pgListingId) {
        return roomOptionRepository.findByPgListingId(pgListingId);
    }

    public RoomOption saveRoomOption(RoomOption option) {
        return roomOptionRepository.save(option);
    }
}

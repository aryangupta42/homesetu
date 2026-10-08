package com.homesetu.controller;

import com.homesetu.model.PgListing;
import com.homesetu.model.RoomOption;
import com.homesetu.service.PgListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
public class PgListingController {

    @Autowired
    private PgListingService pgListingService;

    @GetMapping
    public ResponseEntity<List<PgListing>> searchListings(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) String genderType,
            @RequestParam(required = false) Boolean hasAc,
            @RequestParam(required = false) Boolean hasWifi,
            @RequestParam(required = false) Boolean foodIncluded,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(defaultValue = "newest") String sortBy
    ) {
        List<PgListing> results = pgListingService.searchListings(
                city, locality, query, maxRent, genderType, hasAc, hasWifi, foodIncluded, isVerified, sortBy
        );
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPgById(@PathVariable Long id) {
        return pgListingService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomOption>> getRoomsForPg(@PathVariable Long id) {
        return ResponseEntity.ok(pgListingService.getRoomsForPg(id));
    }

    @PostMapping
    public ResponseEntity<PgListing> createListing(@RequestBody PgListing listing) {
        PgListing created = pgListingService.saveListing(listing);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(@PathVariable Long id, @RequestBody PgListing listing) {
        return pgListingService.getById(id)
                .map(existing -> {
                    listing.setId(id);
                    return ResponseEntity.ok(pgListingService.saveListing(listing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        pgListingService.deleteListing(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PgListing>> getOwnerListings(@PathVariable Long ownerId) {
        return ResponseEntity.ok(pgListingService.getByOwnerId(ownerId));
    }

    @PostMapping("/{id}/rooms")
    public ResponseEntity<RoomOption> addRoomOption(@PathVariable Long id, @RequestBody RoomOption option) {
        option.setPgListingId(id);
        return ResponseEntity.ok(pgListingService.saveRoomOption(option));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<?> toggleVerify(@PathVariable Long id) {
        PgListing updated = pgListingService.toggleVerification(id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}

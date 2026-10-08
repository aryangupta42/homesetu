package com.homesetu.dto;

public class BookingActionRequest {
    private String action; // "ACCEPT" or "REJECT"
    private String note;

    public BookingActionRequest() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}

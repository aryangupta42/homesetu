package com.homesetu.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String role = "STUDENT"; // "STUDENT" or "OWNER"
    private String phone;
    private String college;
    private String city;

    public RegisterRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}

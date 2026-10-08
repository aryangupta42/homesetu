package com.homesetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HomeSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomeSetuApplication.class, args);
        System.out.println("====================================================");
        System.out.println("   🏠 HomeSetu Backend is running on port 8088!    ");
        System.out.println("   API Docs / Endpoints: http://localhost:8088/api  ");
        System.out.println("   H2 Console: http://localhost:8088/h2-console     ");
        System.out.println("====================================================");
    }
}

package com.datavision.controller;

import com.datavision.dto.CurrencyResponse;
import com.datavision.service.CurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/currency")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping
    public ResponseEntity<CurrencyResponse> getDailySeries(@RequestParam(defaultValue = "30") int days) {
        int boundedDays = Math.min(Math.max(days, 1), 120);
        return ResponseEntity.ok(currencyService.getDailySeries(boundedDays));
    }
}

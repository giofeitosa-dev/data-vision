package com.datavision.dto;

import java.util.List;

public record CurrencyResponse(
        String base,
        List<DayPoint> days
) {
    public record DayPoint(
            String date,
            double usdBid,
            double eurBid
    ) {
    }
}

package com.datavision.dto;

import java.util.List;

public record WeatherResponse(
        String city,
        String country,
        Current current,
        List<Daily> daily
) {
    public record Current(
            double temperature,
            double feelsLike,
            double humidity,
            double windSpeed,
            String weatherCode
    ) {
    }

    public record Daily(
            String date,
            double maxTemperature,
            double minTemperature,
            int precipitationProbability
    ) {
    }
}

package com.datavision.service;

import com.datavision.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    private static final String GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final String FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String userAgent;

    public WeatherService(RestClient.Builder builder, ObjectMapper objectMapper, @Value("${app.user-agent}") String userAgent) {
        this.restClient = builder.build();
        this.objectMapper = objectMapper;
        this.userAgent = userAgent;
    }

    public WeatherResponse getForecastByCity(String city) {
        JsonNode geocoding = readJson(restClient.get()
                .uri(UriComponentsBuilder.fromUriString(GEOCODING_URL)
                        .queryParam("name", city)
                        .queryParam("count", 1)
                        .build()
                        .toUri())
                .header("User-Agent", userAgent)
                .retrieve()
                .body(String.class));

        JsonNode place = geocoding.path("results").path(0);
        if (place.isMissingNode()) {
            throw new IllegalArgumentException("Cidade não encontrada: " + city);
        }

        double latitude = place.path("latitude").asDouble();
        double longitude = place.path("longitude").asDouble();
        String country = place.path("country").asText();

        JsonNode forecast = readJson(restClient.get()
                .uri(UriComponentsBuilder.fromUriString(FORECAST_URL)
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("current", "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code")
                        .queryParam("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max")
                        .queryParam("forecast_days", 7)
                        .queryParam("timezone", "auto")
                        .build()
                        .toUri())
                .header("User-Agent", userAgent)
                .retrieve()
                .body(String.class));

        return toResponse(place, forecast);
    }

    private JsonNode readJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao processar resposta da API externa", e);
        }
    }

    private WeatherResponse toResponse(JsonNode place, JsonNode forecast) {
        JsonNode current = forecast.path("current");
        JsonNode daily = forecast.path("daily");

        List<WeatherResponse.Daily> days = new ArrayList<>();
        JsonNode dates = daily.path("time");
        JsonNode maxTemps = daily.path("temperature_2m_max");
        JsonNode minTemps = daily.path("temperature_2m_min");
        JsonNode precip = daily.path("precipitation_probability_max");

        for (int i = 0; i < dates.size(); i++) {
            days.add(new WeatherResponse.Daily(
                    dates.get(i).asText(),
                    maxTemps.get(i).asDouble(),
                    minTemps.get(i).asDouble(),
                    precip.get(i).asInt()
            ));
        }

        return new WeatherResponse(
                place.path("name").asText(),
                place.path("country").asText(),
                new WeatherResponse.Current(
                        current.path("temperature_2m").asDouble(),
                        current.path("apparent_temperature").asDouble(),
                        current.path("relative_humidity_2m").asDouble(),
                        current.path("wind_speed_10m").asDouble(),
                        current.path("weather_code").asText()
                ),
                days
        );
    }
}

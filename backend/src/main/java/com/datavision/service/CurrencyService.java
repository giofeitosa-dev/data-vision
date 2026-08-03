package com.datavision.service;

import com.datavision.dto.CurrencyResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CurrencyService {

    private static final String DAILY_URL = "https://economia.awesomeapi.com.br/json/daily/";
    private static final String BASE = "BRL";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public CurrencyService(RestClient.Builder builder, ObjectMapper objectMapper) {
        this.restClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public CurrencyResponse getDailySeries(int days) {
        JsonNode usd = fetchSeries("USD-" + BASE, days);
        JsonNode eur = fetchSeries("EUR-" + BASE, days);

        Map<String, double[]> byDate = new LinkedHashMap<>();
        collect(usd, byDate, 0);
        collect(eur, byDate, 1);

        List<CurrencyResponse.DayPoint> points = new ArrayList<>();
        for (Map.Entry<String, double[]> entry : byDate.entrySet()) {
            double dayUsd = entry.getValue()[0];
            double dayEur = entry.getValue()[1];
            if (dayUsd == 0.0 || dayEur == 0.0) {
                continue;
            }
            points.add(new CurrencyResponse.DayPoint(entry.getKey(), dayUsd, dayEur));
        }

        return new CurrencyResponse(BASE, points);
    }

    private JsonNode fetchSeries(String pair, int days) {
        String json = restClient.get()
                .uri(UriComponentsBuilder.fromUriString(DAILY_URL + pair + "/" + days)
                        .build()
                        .toUri())
                .retrieve()
                .body(String.class);
        return parse(json);
    }

    private JsonNode parse(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao processar resposta da AwesomeAPI", e);
        }
    }

    private void collect(JsonNode series, Map<String, double[]> byDate, int index) {
        for (JsonNode entry : series) {
            String date = Instant.ofEpochSecond(entry.path("timestamp").asLong())
                    .atZone(ZoneOffset.UTC)
                    .format(DateTimeFormatter.ISO_LOCAL_DATE);
            double bid = entry.path("bid").asDouble();
            byDate.computeIfAbsent(date, k -> new double[2])[index] = bid;
        }
    }
}

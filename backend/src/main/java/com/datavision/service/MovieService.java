package com.datavision.service;

import com.datavision.dto.MovieSummary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {

    private static final String TMDB_URL = "https://api.themoviedb.org/3/movie/";
    private static final String LANGUAGE = "pt-BR";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public MovieService(RestClient.Builder builder, ObjectMapper objectMapper,
                        @Value("${app.tmdb.api-key:}") String apiKey) {
        this.restClient = builder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
    }

    public List<MovieSummary> getMovies(String category) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("TMDB_API_KEY não configurada. Defina a variável de ambiente TMDB_API_KEY.");
        }

        String json = restClient.get()
                .uri(UriComponentsBuilder.fromUriString(TMDB_URL + category)
                        .queryParam("api_key", apiKey)
                        .queryParam("language", LANGUAGE)
                        .build()
                        .toUri())
                .retrieve()
                .body(String.class);

        return parse(json);
    }

    private List<MovieSummary> parse(String json) {
        try {
            JsonNode results = objectMapper.readTree(json).path("results");
            List<MovieSummary> movies = new ArrayList<>();
            for (JsonNode movie : results) {
                movies.add(new MovieSummary(
                        movie.path("title").asText(),
                        movie.path("release_date").asText(),
                        movie.path("vote_average").asDouble(),
                        movie.path("vote_count").asInt()
                ));
            }
            return movies;
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao processar resposta do TMDB", e);
        }
    }
}

package com.datavision.dto;

public record MovieSummary(
        String title,
        String releaseDate,
        double voteAverage,
        int voteCount
) {
}

package com.datavision.controller;

import com.datavision.dto.MovieSummary;
import com.datavision.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/{category}")
    public ResponseEntity<?> getMovies(@PathVariable String category) {
        if (!category.equals("popular") && !category.equals("top_rated")) {
            return ResponseEntity.badRequest().build();
        }
        try {
            List<MovieSummary> movies = movieService.getMovies(category);
            return ResponseEntity.ok(movies);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }
}

package com.uims.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TrafficServiceClientTest {

    @Mock
    private RestTemplate restTemplate;

    private TrafficServiceClient trafficServiceClient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        trafficServiceClient = new TrafficServiceClient(restTemplate, "http://localhost:8090");
    }

    @Test
    void testGetForecastSuccess() {
        List<Map<String, Object>> mockResponse = new ArrayList<>();
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", "2026-09-18 10:00:00");
        data.put("predicted_congestion_pct", 75.0);
        mockResponse.add(data);

        ResponseEntity<List<Map<String, Object>>> responseEntity = ResponseEntity.ok(mockResponse);

        when(restTemplate.exchange(
                eq("http://localhost:8090/forecast/1"),
                eq(HttpMethod.GET),
                isNull(),
                ArgumentMatchers.<ParameterizedTypeReference<List<Map<String, Object>>>>any()
        )).thenReturn(responseEntity);

        List<Map<String, Object>> result = trafficServiceClient.getForecast("1");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(75.0, result.get(0).get("predicted_congestion_pct"));
    }

    @Test
    void testGetForecastFallback() {
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                isNull(),
                ArgumentMatchers.<ParameterizedTypeReference<List<Map<String, Object>>>>any()
        )).thenThrow(new RestClientException("Connection refused"));

        List<Map<String, Object>> result = trafficServiceClient.getForecast("1");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}

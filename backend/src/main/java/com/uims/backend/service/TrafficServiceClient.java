package com.uims.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class TrafficServiceClient {

    @Value("${traffic.service.url:http://localhost:8090}")
    private String trafficServiceUrl;

    private final RestTemplate restTemplate;

    public TrafficServiceClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(3000);
        this.restTemplate = new RestTemplate(factory);
    }

    // Expose constructor for testing
    public TrafficServiceClient(RestTemplate restTemplate, String trafficServiceUrl) {
        this.restTemplate = restTemplate;
        this.trafficServiceUrl = trafficServiceUrl;
    }

    public List<Map<String, Object>> getForecast(String segmentId) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    trafficServiceUrl + "/forecast/" + segmentId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<List<Double>> getWeeklySummary(String segmentId) {
        try {
            ResponseEntity<List<List<Double>>> response = restTemplate.exchange(
                    trafficServiceUrl + "/forecast/" + segmentId + "/weekly-summary",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<List<Double>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<Map<String, Object>> getRecommendations(Map<String, Object> request) {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    trafficServiceUrl + "/recommend-window",
                    HttpMethod.POST,
                    new org.springframework.http.HttpEntity<>(request),
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}

package com.uims.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class RoadImageClassificationServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RoadImageClassificationService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(service, "mlServiceUrl", "http://localhost:8000/classify-road-image");
        ReflectionTestUtils.setField(service, "isEnabled", true);
    }

    @Test
    void classifyImage_Success() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image content".getBytes());
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("is_road_related", true);
        mockResponse.put("urgency_score", 5);

        when(restTemplate.postForEntity(any(String.class), any(), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        Map<String, Object> result = service.classifyImage(file);

        assertEquals("processed", result.get("ml_status"));
        assertEquals(true, result.get("is_road_related"));
        assertEquals(5, result.get("urgency_score"));
    }

    @Test
    void classifyImage_Failure_Fallback() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image content".getBytes());
        
        when(restTemplate.postForEntity(any(String.class), any(), eq(Map.class)))
                .thenThrow(new RestClientException("Connection refused"));

        Map<String, Object> result = service.classifyImage(file);

        assertEquals("pending_manual_review", result.get("ml_status"));
    }

    @Test
    void classifyImage_Disabled() {
        ReflectionTestUtils.setField(service, "isEnabled", false);
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image content".getBytes());

        Map<String, Object> result = service.classifyImage(file);

        assertEquals("disabled", result.get("ml_status"));
    }
}

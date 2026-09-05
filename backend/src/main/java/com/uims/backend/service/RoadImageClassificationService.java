package com.uims.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@Service
public class RoadImageClassificationService {

    @Value("${ml.service.url:http://localhost:8000/classify-road-image}")
    private String mlServiceUrl;

    @Value("${road-image-classification.enabled:true}")
    private boolean isEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> classifyImage(MultipartFile file) {
        if (!isEnabled) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("ml_status", "disabled");
            return fallback;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(mlServiceUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                result.put("ml_status", "processed");
                return result;
            } else {
                return getFallbackResponse();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return getFallbackResponse();
        }
    }

    private Map<String, Object> getFallbackResponse() {
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("ml_status", "pending_manual_review");
        return fallback;
    }
}

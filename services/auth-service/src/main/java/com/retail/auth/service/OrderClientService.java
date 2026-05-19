package com.retail.auth.service;

import com.retail.auth.dto.OrderRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderClientService {

    private final RestTemplate restTemplate;

    private static final String ORDER_SERVICE_URL =
            "http://order-service:8082/api/v1/orders";

    public OrderClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String createOrder(OrderRequest request) {
        return restTemplate.postForObject(
                ORDER_SERVICE_URL,
                request,
                String.class
        );
    }
}
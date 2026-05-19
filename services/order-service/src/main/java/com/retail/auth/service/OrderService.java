package com.retail.auth.service;

import com.retail.auth.dto.OrderRequest;
import com.retail.auth.entity.Order;
import com.retail.auth.repository.OrderRepository;
import com.retail.auth.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setProductName(request.getProductName());
        order.setQuantity(request.getQuantity());
        order.setTotalAmount(request.getTotalAmount());

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found with id: " + id));
    }
}
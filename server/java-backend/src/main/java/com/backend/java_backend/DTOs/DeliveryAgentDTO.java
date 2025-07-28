package com.backend.java_backend.DTOs;

public class DeliveryAgentDTO {
    private String deliveryAgent;

    public DeliveryAgentDTO() {
    }

    public DeliveryAgentDTO(String deliveryAgent) {
        this.deliveryAgent = deliveryAgent;
    }

    public String getDeliveryAgent() {
        return deliveryAgent;
    }

    public void setDeliveryAgent(String deliveryAgent) {
        this.deliveryAgent = deliveryAgent;
    }
}

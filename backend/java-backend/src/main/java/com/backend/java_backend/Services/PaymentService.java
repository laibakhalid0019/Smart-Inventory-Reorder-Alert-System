package com.backend.java_backend.Services;
import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.Payment;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.PaymentDTO;
import com.backend.java_backend.Repos.OrderRepo;
import com.backend.java_backend.Repos.PaymentRepo;
import com.backend.java_backend.Repos.UserRepo;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Service
public class PaymentService {

    private PaymentRepo paymentRepo;
    private UserRepo userRepo;
    private OrderRepo orderRepo;
    @Value("${stripe.api.key}")
    private String stripeApiKey;


    public PaymentIntent chargeAmount(Long orderId, String username, float amount, String Currency) throws StripeException {
        Payment payment = new Payment();
        Stripe.apiKey = stripeApiKey;
        PaymentIntentCreateParams params = new PaymentIntentCreateParams.Builder()
                .setAmount((long) amount)
                .setCurrency(Currency)
                .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        String intentId =  paymentIntent.getId();
        User user =  userRepo.findByUsername(username);
        Order order = orderRepo.findByOrderId(orderId);

        //creating payment object
        payment.setUser(user);
        payment.setOrder(order);
        payment.setGateway("stripe");
        payment.setTransactionId(intentId);
        payment.setAmount(paymentIntent.getAmount());
        payment.setCurrency(paymentIntent.getCurrency().toUpperCase());
        payment.setStatus(Payment.Status.SUCCESS);
        payment.setPaymentMethod(paymentIntent.getPaymentMethod());
        payment.setPaidAt(new Timestamp(paymentIntent.getCreated()));
        payment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        paymentRepo.save(payment);


        return paymentIntent;
    }
}

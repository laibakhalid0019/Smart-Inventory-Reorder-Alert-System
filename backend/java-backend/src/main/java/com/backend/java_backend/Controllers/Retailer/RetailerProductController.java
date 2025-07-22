package com.backend.java_backend.Controllers.Retailer;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/retailer/product")
public class RetailerProductController {


    @Autowired
    private ProductService productService;
    @PostMapping("/view-products")
    public ResponseEntity<?> viewProducts(@RequestParam String category) {
        List<Product> products = productService.findByCategory(category);
        if(products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(products);
    }
}

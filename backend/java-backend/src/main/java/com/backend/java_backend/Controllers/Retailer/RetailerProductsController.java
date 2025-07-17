package com.backend.java_backend.Controllers.Retailer;


import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Services.MovementLogsService;
import com.backend.java_backend.Services.ProductService;
import com.backend.java_backend.Services.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retailer/products")
public class RetailerProductsController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private MovementLogsService movementLogsService;

    @Autowired
    private StockService stockService;

    //get all products
    @GetMapping("/get-products")
    public ResponseEntity<?> getAllProducts(){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Fetching all products for username: " + username);
        List<Product> allProducts = productService.findAll(username);
        System.out.println("Products fetched: " + allProducts);
        return ResponseEntity.status(HttpStatus.OK).body("All products found against this username" + allProducts);
    }

    //add a product
    @PostMapping("/add-product")
    public ResponseEntity<?> addProduct(@RequestBody Product product){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Adding product: " + product + " by username: " + username);
        Product product1 = productRepo.save(product);
        System.out.println("Product saved: " + product1);
        String actionType = "ADD";

        //add movement log into the table of movement logs
        movementLogsService.addLogsInTable(product1,username,actionType);
        System.out.println("Movement log added for product: " + product1);

        //add product into the stock
        stockService.addStock(product1,username);
        System.out.println("Product added to stock: " + product1);
        return ResponseEntity.status(HttpStatus.OK).body("Product added successfully" + product1);
    }

    //delete a product by SKU
    @DeleteMapping("/delete-product/{SKU}")
    public ResponseEntity<?> deleteProduct(@PathVariable String SKU) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Deleting product with SKU: " + SKU + " by username: " + username);
        Product product = productRepo.findBySku(SKU);
        System.out.println("Product found: " + product);
        Boolean isDeleted = productService.deleteProductBySku(SKU);
        if (!isDeleted) {
            System.out.println("Product not found or could not be deleted.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        // Add movement log of deletion into the table
        movementLogsService.addLogsInTable(product, username, "DELETE");
        System.out.println("Movement log added for deletion of product: " + product);

        // Delete the product from the stocks
        stockService.deleteStock(product.getId());
        System.out.println("Product deleted from stock: " + product);
        return ResponseEntity.status(HttpStatus.OK).body("The Product is deleted successfully");
    }

    //delete product by ID
    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Product product = productRepo.findById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        Boolean isDeleted = productService.deleteProductById(id);
        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        // Add movement log of deletion into the table
        movementLogsService.addLogsInTable(product, username, "DELETE");

        // Delete product from the stocks
        stockService.deleteStock(product.getId());
        return ResponseEntity.status(HttpStatus.OK).body("The Product is deleted successfully");
    }

    //update product
    @PutMapping("/update-product")
    public ResponseEntity<?> updateProduct(@RequestBody Product product){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        Product product1 = productRepo.save(product);
        movementLogsService.addLogsInTable(product1,username,"UPDATE");
        //update stock function
        return ResponseEntity.status(HttpStatus.OK).body("Product updated successfully");
    }

}

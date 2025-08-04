package com.backend.java_backend.Controllers.Distributor;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.DTOs.ProductDTO;
import com.backend.java_backend.Services.CloudinaryService;
import com.backend.java_backend.Services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/distributor/product")
public class DistributorProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/get-info")
    public ResponseEntity<?> getInfo(){
        return ResponseEntity.status(HttpStatus.OK).body("DISTRIBUTOR");
    }


    @PostMapping(value = "/add-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        // Log raw product input
        System.out.println("Received product JSON: " + productJson);

        // Parse JSON into ProductDTO
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        ProductDTO productDTO = mapper.readValue(productJson, ProductDTO.class);

        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated distributor: " + username);

        // Validate file type - Accept common image formats
        String contentType = file.getContentType();
        System.out.println("File content type: " + contentType);

        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body("Only image files are allowed");
        }

        // Upload to Cloudinary
        String url = cloudinaryService.uploadFile(file);
        if (url.equals("error")) {
            System.out.println("Cloudinary upload failed.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image upload failed");
        }

        // Save product
        Product product = productService.addProduct(productDTO, username, url);
        if (product == null) {
            System.out.println("Product creation failed.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not created");
        }

        System.out.println("Product created: " + product.getName());
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }





    @GetMapping("/view-products")
    public ResponseEntity<?> getProducts(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Product> productList = productService.findAll(username);
        if(productList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }



    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        System.out.println("Attempting to delete product with ID: " + id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated user: " + username);

        Map<String, Object> result = productService.deleteProductById(id);
        boolean success = (boolean) result.get("success");
        String message = (String) result.get("message");

        System.out.println("Delete result for ID " + id + ": " + message);

        if(!success){
            // If the reason is foreign key constraint, return 409 Conflict status
            if(message.contains("associated with")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
            }
            // Otherwise it's a not found case
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @DeleteMapping("/delete-product-by-sku/{sku}")
    public ResponseEntity<?> deleteProductBySku(@PathVariable String sku){
        System.out.println("Attempting to delete product with SKU: " + sku);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated user: " + username);

        Map<String, Object> result = productService.deleteProductBySku(sku);
        boolean success = (boolean) result.get("success");
        String message = (String) result.get("message");

        System.out.println("Delete result for SKU " + sku + ": " + message);

        if(!success){
            // If the reason is foreign key constraint, return 409 Conflict status
            if(message.contains("associated with")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
            }
            // Otherwise it's a not found case
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PutMapping("/update-product/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Product updatedProduct = productService.updateProduct(id, productDTO, username);

        if(updatedProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found or you don't have permission to update it");
        }

        return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
    }

    @PutMapping(value = "/update-product-with-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductWithImage(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(name = "file", required = false) MultipartFile file
    ) throws IOException {
        System.out.println("Attempting to update product with ID: " + id);

        // Parse JSON into ProductDTO
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        ProductDTO productDTO = mapper.readValue(productJson, ProductDTO.class);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated distributor: " + username);

        // Upload image only if provided
        if (file != null && !file.isEmpty()) {
            // Validate file type - Accept common image formats
            String contentType = file.getContentType();
            System.out.println("File content type: " + contentType);

            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                        .body("Only image files are allowed");
            }

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadFile(file);
            if (imageUrl.equals("error")) {
                System.out.println("Cloudinary upload failed.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image upload failed");
            }

            // Only set the image URL if a new image was uploaded
            productDTO.setImageUrl(imageUrl);
        }



        // Update the product
        Product updatedProduct = productService.updateProduct(id, productDTO, username);

        if (updatedProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found or you don't have permission to update it");
        }

        return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
    }
    }

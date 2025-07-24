package com.backend.java_backend.Controllers.Distributor;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.DTOs.ProductDTO;
import com.backend.java_backend.Services.CloudinaryService;
import com.backend.java_backend.Services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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

    @PostMapping("/add-product")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO, @RequestParam("file") MultipartFile file) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!Objects.equals(file.getContentType(), "image/jpeg")){
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Invalid file type");
        }
        String url = cloudinaryService.uploadFile(file);
        if(url.equals("error")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("error in uploading file");
        }
        Product product = productService.addProduct(productDTO,username,url);
        if(product == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product not created");
        }
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

    @PostMapping("/delete-product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        Boolean isDeleted = productService.deleteProductById(id);
        if(!isDeleted){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("The product is deleted");
    }

    @PostMapping("/delete-product/{sku}")
    public ResponseEntity<?> deleteProduct(@PathVariable String sku){
        Boolean isDeleted = productService.deleteProductBySku(sku);
        if(!isDeleted){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("The product is deleted");
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

    @PostMapping("/view-products-by-category")
    public ResponseEntity<?> viewProductsByCategory(@RequestParam String category){
        List<Product> productsList = productService.findByCategory(category);
        if(productsList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(productsList);
    }
}

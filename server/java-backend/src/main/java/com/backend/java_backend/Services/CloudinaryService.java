package com.backend.java_backend.Services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            System.out.println("Cloudinary upload result: " + uploadResult);

            // Check if the secure_url is present in the response
            if (uploadResult != null && uploadResult.containsKey("secure_url")) {
                return uploadResult.get("secure_url").toString();
            } else {
                System.out.println("Cloudinary upload missing secure_url");
                return "error";
            }
        } catch (Exception e) {
            System.out.println("Cloudinary upload error: " + e.getMessage());
            e.printStackTrace();
            return "error";
        }
    }
}

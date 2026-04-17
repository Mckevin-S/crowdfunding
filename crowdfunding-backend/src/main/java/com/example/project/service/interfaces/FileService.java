package com.example.project.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    
    /**
     * Upload an image file, resize/optimize it, and save it locally.
     * @param file the multipart file from client
     * @return the generated URL path to access the file
     */
    String uploadAndOptimizeImage(MultipartFile file);

    /**
     * Upload a KYC document (PDF or image) and save it as-is.
     * @param file the multipart file from client
     * @return the generated URL path to access the file
     */
    String uploadDocument(MultipartFile file);
}


package com.example.project.service.impl;

import com.example.project.service.interfaces.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.UUID;

@Service
@Slf4j
public class FileServiceImpl implements FileService {

    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;

    private static final int MAX_WIDTH = 1200;

    @Override
    public String uploadAndOptimizeImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            // Create target directory if it does not exist
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            // Generate unique filename
            String newFileName = UUID.randomUUID().toString() + ".jpg"; // Always convert to JPG
            Path targetPath = targetLocation.resolve(newFileName);

            // Optimize and save the image
            optimizeAndSaveImage(file, targetPath.toFile());

            // Notice how the URL needs to map to the WebConfig resource handler path
            // For example, /files/images/xxx.jpg
            String fileDownloadUri = "/files/images/" + newFileName;
            log.info("Optimized image saved at: {}", targetPath);
            return fileDownloadUri;
        } catch (Exception ex) {
            log.error("Could not store image. Please try again!", ex);
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    private void optimizeAndSaveImage(MultipartFile file, File destFile) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IllegalArgumentException("Not a valid image file");
        }

        // Calculate new dimensions (max width 1200)
        int currentWidth = originalImage.getWidth();
        int currentHeight = originalImage.getHeight();
        int newWidth = currentWidth;
        int newHeight = currentHeight;

        if (currentWidth > MAX_WIDTH) {
            newWidth = MAX_WIDTH;
            newHeight = (int) (((double) MAX_WIDTH / currentWidth) * currentHeight);
        }

        // Keep transparency if transforming PNG to JPG? We need a white background to avoid black background artifacts.
        BufferedImage newImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = newImage.createGraphics();
        
        // Fill white background (useful if source is PNG with transparency)
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, newWidth, newHeight);

        // Apply rendering hints for better quality smooth scaling
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        // Compress and save as JPEG
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) throw new IllegalStateException("No writers found");
        ImageWriter writer = writers.next();

        try (ImageOutputStream ios = ImageIO.createImageOutputStream(destFile)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.75f); // 75% quality for a good trade-off (compression)
            }
            writer.write(null, new IIOImage(newImage, null, null), param);
        } finally {
            writer.dispose();
        }
    }
}

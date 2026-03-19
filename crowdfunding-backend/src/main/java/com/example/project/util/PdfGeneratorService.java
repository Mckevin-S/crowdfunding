package com.example.project.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Service utility for generating PDF documents.
 * Used for issuing donation receipts, loan contracts, and equity certificates.
 */
@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public byte[] generateDonationReceipt(String donorName, String projectName, BigDecimal amount) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("REÇU DE DON - " + projectName, titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("\n"));
        document.add(new Paragraph("Donateur : " + donorName));
        document.add(new Paragraph("Projet : " + projectName));
        document.add(new Paragraph("Montant : " + amount + " FCFA"));
        document.add(new Paragraph("Date : " + java.time.LocalDateTime.now().format(DATE_FORMATTER)));
        document.add(new Paragraph("\nMerci pour votre contribution !"));

        document.close();
        return out.toByteArray();
    }

    public byte[] generateShareCertificate(String investorName, String projectName, Long sharesCount) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, out);

        document.open();
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
        Paragraph title = new Paragraph("CERTIFICAT D'ACTION", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("\n\n"));
        Paragraph content = new Paragraph("Ceci certifie que " + investorName + " est détenteur de " + 
                sharesCount + " actions dans le projet : " + projectName);
        content.setAlignment(Element.ALIGN_CENTER);
        document.add(content);

        document.close();
        return out.toByteArray();
    }
}

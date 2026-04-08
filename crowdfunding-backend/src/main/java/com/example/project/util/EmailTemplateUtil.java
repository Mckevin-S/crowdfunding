package com.example.project.util;

/**
 * Utility class for generating premium HTML email templates.
 * Provides a consistent, branded look for all system communications.
 */
public class EmailTemplateUtil {

    private static final String PRIMARY_COLOR = "#1E293B"; // Dark Slate
    private static final String ACCENT_COLOR = "#D4AF37";  // Gold
    private static final String TEXT_COLOR = "#334155";
    private static final String BG_COLOR = "#F8FAFC";

    /**
     * Wraps a message in a premium HTML layout.
     * 
     * @param title The title shown in the email header.
     * @param content The main message content (can include HTML).
     * @param footer Additional footer text or links.
     * @return A complete HTML string for the email.
     */
    public static String wrapWithPremiumTemplate(String title, String content, String footer) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "<meta charset='UTF-8'>" +
               "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "<style>" +
               "  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: " + BG_COLOR + "; margin: 0; padding: 0; }" +
               "  .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }" +
               "  .header { background-color: " + PRIMARY_COLOR + "; padding: 40px 20px; text-align: center; border-bottom: 4px solid " + ACCENT_COLOR + "; }" +
               "  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }" +
               "  .content { padding: 40px 30px; line-height: 1.6; color: " + TEXT_COLOR + "; font-size: 16px; }" +
               "  .footer { background-color: #F1F5F9; padding: 20px; text-align: center; color: #64748B; font-size: 13px; border-top: 1px solid #E2E8F0; }" +
               "  .button { display: inline-block; padding: 12px 24px; background-color: " + ACCENT_COLOR + "; color: " + PRIMARY_COLOR + " !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }" +
               "  .highlight { color: " + ACCENT_COLOR + "; font-weight: bold; }" +
               "  .code-container { background-color: #F8FAFC; border: 1px dashed #CBD5E1; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; }" +
               "  .code { font-size: 32px; font-weight: 800; letter-spacing: 5px; color: " + PRIMARY_COLOR + "; margin: 0; }" +
               "  hr { border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "  <div class='wrapper'>" +
               "    <div class='header'>" +
               "      <h1>" + title + "</h1>" +
               "    </div>" +
               "    <div class='content'>" +
               "      " + content +
               "    </div>" +
               "    <div class='footer'>" +
               "      " + footer + "<br><br>" +
               "      &copy; 2026 Crowdfunding. Tous droits réservés." +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }

    public static String getWelcomeTemplate(String name) {
        String content = "<p>Bonjour <strong>" + name + "</strong>,</p>" +
                         "<p>Bienvenue sur notre plateforme de crowdfunding ! Nous sommes ravis de vous compter parmi nous.</p>" +
                         "<p>Que vous soyez ici pour donner vie à un projet ou pour soutenir des initiatives inspirantes, nous sommes là pour vous accompagner.</p>" +
                         "<a href='#' class='button'>Commencer l'expédition</a>" +
                         "<p>À très bientôt sur la plateforme !</p>";
        return wrapWithPremiumTemplate("Bienvenue à Bord", content, "Besoin d'aide ? Contactez notre support.");
    }

    public static String getPasswordResetTemplate(String code) {
        String content = "<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>" +
                         "<p>Veuillez utiliser le code de sécurité suivant pour finaliser l'opération :</p>" +
                         "<div class='code-container'>" +
                         "  <p class='code'>" + code + "</p>" +
                         "</div>" +
                         "<p><small>Ce code est valable pendant 15 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</small></p>";
        return wrapWithPremiumTemplate("Sécurisation de Compte", content, "Ceci est un message automatique, merci de ne pas y répondre.");
    }

    public static String getActionTemplate(String title, String message) {
        String content = "<p>" + message + "</p>" +
                         "<hr>" +
                         "<p>Pour voir plus de détails, connectez-vous à votre tableau de bord.</p>" +
                         "<a href='#' class='button'>Accéder au Dashboard</a>";
        return wrapWithPremiumTemplate(title, content, "Notifications Crowdfunding");
    }
}

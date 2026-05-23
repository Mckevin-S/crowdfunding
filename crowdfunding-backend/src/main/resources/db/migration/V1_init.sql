-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 23 mai 2026 à 02:41
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `crowdfunding`
--

-- --------------------------------------------------------

--
-- Structure de la table `ai_analysis`
--

DROP TABLE IF EXISTS `ai_analysis`;
CREATE TABLE IF NOT EXISTS `ai_analysis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `analysis` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `risk_score` float DEFAULT NULL,
  `success_score` float DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKejvea1hyiun23311a2kcdo4sn` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ai_analysis`
--

INSERT INTO `ai_analysis` (`id`, `analysis`, `created_at`, `risk_score`, `success_score`, `project_id`) VALUES
(1, 'Impossible de contacter l\'IA pour le moment. (Erreur technique: Failed to resolve \'api.openai.com\' [A(1)])', '2026-03-28 19:31:58.552258', 30, 50, 2),
(2, 'Mode démo (Clé API Gemini manquante) : Projet prometteur nécessitant plus de détails.', '2026-03-28 20:37:07.350585', 50, 50, 1),
(4, 'Erreur Gemini : {\n  \"error\": {\n    \"code\": 404,\n    \"message\": \"models/gemini-pro is not found for API version v1, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.\",\n    \"status\": \"NOT_FOUND\"\n  }\n}\n', '2026-05-20 13:18:50.712858', 30, 50, 3);

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` json DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `action`, `details`, `ip`, `timestamp`, `user_id`) VALUES
(1, 'PROJET_STATUS_UPDATE', '{\"notes\": \"\", \"projetId\": 1, \"nouveauStatut\": \"EN_COURS\"}', 'UNKNOWN', '2026-03-26 04:36:33.186012', 3),
(2, 'PROJET_STATUS_UPDATE', '{\"notes\": \"\", \"projetId\": 2, \"nouveauStatut\": \"EN_COURS\"}', 'UNKNOWN', '2026-03-28 19:07:32.975178', 3),
(3, 'PROJET_STATUS_UPDATE', '{\"notes\": \"\", \"projetId\": 3, \"nouveauStatut\": \"EN_COURS\"}', 'UNKNOWN', '2026-04-08 11:03:15.351664', 3),
(4, 'PROJET_STATUS_UPDATE', '{\"notes\": \"\", \"projetId\": 3, \"nouveauStatut\": \"EN_COURS\"}', 'UNKNOWN', '2026-04-08 11:03:15.418360', 3);

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgkoamotsfr3mc0pwa1qrrmwhi` (`project_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `contenu`, `created_at`, `project_id`, `user_id`) VALUES
(1, 'kiokjkj', '2026-03-28 20:37:27.234266', 1, 2),
(2, 'yo\n', '2026-04-01 00:00:13.479435', 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `contributions`
--

DROP TABLE IF EXISTS `contributions`;
CREATE TABLE IF NOT EXISTS `contributions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) DEFAULT NULL,
  `contribution_date` datetime(6) DEFAULT NULL,
  `status` enum('ATTENTE','CONFIRMEE','ECHOUER','REMBOURSER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `shares_received` bigint DEFAULT NULL,
  `anonymous` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `mobile_money_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` enum('STRIPE','MOBILE_MONEY','INVESTISSEMENT','REMBOURSEMENT','RETRAIT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_payment_intent_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reward_id` bigint DEFAULT NULL,
  `amount_xaf` decimal(15,2) NOT NULL,
  `source_amount` decimal(15,2) DEFAULT NULL,
  `source_currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlcho2lx4i4t2iqrnd1tn4luir` (`project_id`),
  KEY `FK4qcv0c1wgs0m7vwo4pwyvel3i` (`user_id`),
  KEY `FKrjintlln7qilgptci8fxf1rey` (`reward_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `equity_details`
--

DROP TABLE IF EXISTS `equity_details`;
CREATE TABLE IF NOT EXISTS `equity_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `distributed_shares` bigint DEFAULT NULL,
  `max_investment_per_investor` decimal(15,2) DEFAULT NULL,
  `min_investment` decimal(15,2) DEFAULT NULL,
  `equity_percentage_offered` decimal(5,2) NOT NULL,
  `price_per_share` decimal(15,2) DEFAULT NULL,
  `total_shares` bigint NOT NULL,
  `post_money_valuation` decimal(20,2) DEFAULT NULL,
  `pre_money_valuation` decimal(20,2) NOT NULL,
  `project_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_764ili5xittr7subqkxsvhm4v` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `interactions`
--

DROP TABLE IF EXISTS `interactions`;
CREATE TABLE IF NOT EXISTS `interactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `type` enum('LIKE','SHARE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqaybusrum207xjihpnruafc19` (`project_id`),
  KEY `FK3en1u622jlvp97u4p5q93qyom` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `interactions`
--

INSERT INTO `interactions` (`id`, `created_at`, `type`, `project_id`, `user_id`) VALUES
(2, '2026-03-29 18:43:55.363245', 'LIKE', 1, 3),
(3, '2026-04-08 09:11:02.723761', 'LIKE', 2, 2),
(4, '2026-04-08 09:11:06.720208', 'SHARE', 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `kyc_documents`
--

DROP TABLE IF EXISTS `kyc_documents`;
CREATE TABLE IF NOT EXISTS `kyc_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `submitted_at` datetime(6) DEFAULT NULL,
  `document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `document_type` enum('CNI','PASSPORT','PERMIS') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `rejection_reason` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('EN_ATTENTE','APPROUVE','REJETE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKllb8bcbbyo994afdepf7f7j63` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `kyc_documents`
--

INSERT INTO `kyc_documents` (`id`, `submitted_at`, `document_url`, `is_verified`, `document_type`, `user_id`, `rejection_reason`, `status`) VALUES
(1, '2026-04-08 11:53:01.357566', 'https://storage.investafrika.com/mock-kyc-nc4xw75yg.pdf', NULL, 'CNI', 4, '', 'APPROUVE'),
(2, '2026-04-08 12:07:54.792282', 'https://storage.investafrika.com/mock-kyc-yrwkk8uro.pdf', NULL, 'CNI', 4, 'PAS BON', 'REJETE'),
(3, '2026-04-08 12:21:42.247763', 'https://storage.investafrika.com/mock-kyc-rbawyrunh.pdf', NULL, 'CNI', 4, '', 'APPROUVE'),
(4, '2026-04-08 12:32:13.154545', 'https://storage.investafrika.com/mock-kyc-0i8ni5zww.pdf', NULL, 'CNI', 4, '', 'APPROUVE'),
(5, '2026-04-17 21:32:27.643724', '/files/documents/a61326d9-666d-4aa5-b481-fd95ffb591f6.pdf', NULL, 'CNI', 2, 'c\'est faux', 'APPROUVE');

-- --------------------------------------------------------

--
-- Structure de la table `litiges`
--

DROP TABLE IF EXISTS `litiges`;
CREATE TABLE IF NOT EXISTS `litiges` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_creation` datetime(6) DEFAULT NULL,
  `date_resolution` datetime(6) DEFAULT NULL,
  `decision_admin` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('NOUVEAU','EN_COURS','RESOLU','REJETE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REMBOURSEMENT','ARNAQUE','VIOLATION_CGU','AUTRE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `accuse_id` bigint DEFAULT NULL,
  `plaignant_id` bigint NOT NULL,
  `projet_concerne_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdvwixx66f3iiy752j66oohiw0` (`accuse_id`),
  KEY `FKe4qwarwgm1p8h4p148ro9np5y` (`plaignant_id`),
  KEY `FKtfuhtxb1mbn342vuriug4niyy` (`projet_concerne_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `loan_details`
--

DROP TABLE IF EXISTS `loan_details`;
CREATE TABLE IF NOT EXISTS `loan_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `duration_months` int NOT NULL,
  `repayment_frequency` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantees` text COLLATE utf8mb4_unicode_ci,
  `monthly_payment` decimal(15,2) DEFAULT NULL,
  `grace_period_months` int DEFAULT NULL,
  `annual_interest_rate` decimal(5,2) NOT NULL,
  `total_interest` decimal(15,2) DEFAULT NULL,
  `total_repayment` decimal(15,2) DEFAULT NULL,
  `project_id` bigint NOT NULL,
  `default_threshold_days` int DEFAULT NULL,
  `penalty_rate` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_tj71et99364ij1cxa1njpp5hx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `receiver_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt05r0b6n0iis8u7dfna4xdh73` (`receiver_id`),
  KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`),
  KEY `FKiasav0fqhcy7ghjy0rwyh9ydn` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `user_id` bigint DEFAULT NULL,
  `categorie` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `created_at`, `is_read`, `message`, `user_id`, `categorie`) VALUES
(1, '2026-03-28 19:07:33.036621', b'0', 'Félicitations ! Votre projet \'Ecole\' a été validé par l\'administration.', 2, NULL),
(2, '2026-03-28 20:37:07.450215', b'0', '📊 L\'IA a terminé l\'analyse de votre projet \'solaire\'. Score de succès : 50%. Consultez les recommandations dès maintenant !', 2, NULL),
(3, '2026-03-29 18:43:55.405483', b'0', 'Super a aimé votre projet : solaire', 2, NULL),
(4, '2026-04-01 00:00:13.539771', b'0', 'Super a commenté votre projet : Ecole', 2, NULL),
(21, '2026-04-01 02:49:08.558854', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(22, '2026-04-01 02:56:03.307811', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(23, '2026-04-01 02:56:36.718500', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(24, '2026-04-01 03:25:49.341516', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(25, '2026-04-01 03:26:33.418020', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 1, NULL),
(26, '2026-04-01 03:41:26.988361', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(27, '2026-04-01 03:45:50.479660', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 2, NULL),
(32, '2026-04-08 08:12:56.735123', b'0', 'Votre compte a été suspendu par l\'administration. Veuillez contacter le support pour plus d\'informations.', 4, NULL),
(33, '2026-04-08 08:14:39.413909', b'0', 'Bonne nouvelle ! Votre compte a été réactivé. Vous pouvez de nouveau accéder à toutes les fonctionnalités.', 4, NULL),
(34, '2026-04-08 11:03:15.608354', b'0', 'Félicitations ! Votre projet \'champ de cacao\' a été validé par l\'administration.', 2, NULL),
(35, '2026-04-08 11:03:15.610880', b'0', 'Félicitations ! Votre projet \'champ de cacao\' a été validé par l\'administration.', 2, NULL),
(36, '2026-04-08 11:58:36.738927', b'0', 'Votre document KYC (CNI) a été approuvé.', 4, NULL),
(37, '2026-04-08 12:09:06.609261', b'0', 'Votre document KYC (CNI) a été approuvé.', 4, NULL),
(38, '2026-04-08 12:22:02.559846', b'0', 'Votre document KYC (CNI) a été approuvé.', 4, NULL),
(39, '2026-04-08 12:32:41.087523', b'0', 'Votre document KYC (CNI) a été rejeté. Motif : pas conforme', 4, NULL),
(40, '2026-04-08 12:33:16.481915', b'0', 'Votre document KYC (CNI) a été approuvé.', 4, NULL),
(41, '2026-04-17 23:01:05.550991', b'0', 'Votre document KYC (CNI) a été approuvé.', 2, 'ALERTE'),
(42, '2026-04-17 23:18:18.186076', b'1', 'Votre document KYC (CNI) a été rejeté. Motif : c\'est faux', 2, 'ALERTE'),
(43, '2026-04-17 23:26:22.097179', b'0', 'Votre document KYC (CNI) a été approuvé.', 2, 'ALERTE'),
(44, '2026-05-20 12:43:49.753566', b'0', 'Votre document KYC (CNI) a été rejeté. Motif : PAS BON', 4, 'ALERTE');

-- --------------------------------------------------------

--
-- Structure de la table `otp_tokens`
--

DROP TABLE IF EXISTS `otp_tokens`;
CREATE TABLE IF NOT EXISTS `otp_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_q1f9i1og9qy5e59sjk036crl2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_71lqwbwtklmljk3qlsugr1mig` (`token`),
  UNIQUE KEY `UK_la2ts67g4oh2sreayswhox1i6` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `platform_configs`
--

DROP TABLE IF EXISTS `platform_configs`;
CREATE TABLE IF NOT EXISTS `platform_configs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `config_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `config_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t4i8qyr9n6q93luloq16w27mg` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `current_amount` decimal(15,2) DEFAULT NULL,
  `funding_goal` decimal(15,2) DEFAULT NULL,
  `status` enum('BROUILLON','ECHEC','EN_COURS','PUBLIE','TERMINE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titre` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funding_type` enum('DON','EQUITY','LOAN','REWARD') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint NOT NULL,
  `all_or_nothing` bit(1) DEFAULT NULL,
  `categorie` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localisation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equity_percentage` decimal(5,2) DEFAULT NULL,
  `interest_rate` decimal(5,2) DEFAULT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `investors_count` int DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `suspension_deadline` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmueqy6cpcwpfl8gnnag4idjt9` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `created_at`, `start_date`, `end_date`, `description`, `current_amount`, `funding_goal`, `status`, `titre`, `funding_type`, `owner_id`, `all_or_nothing`, `categorie`, `localisation`, `equity_percentage`, `interest_rate`, `cover_image`, `investors_count`, `admin_notes`, `suspension_deadline`) VALUES
(1, '2026-03-25 11:17:59.334596', '2026-03-25', '2027-04-01', 'Don des panneaux ', 0.00, 1000000.00, 'BROUILLON', 'solaire', 'DON', 2, b'1', NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(2, '2026-03-26 15:03:50.198855', '2026-03-26', '2026-04-10', 'ertfgvybhnjkm', 0.00, 1000000.00, 'EN_COURS', 'Ecole', 'DON', 2, b'1', 'Education', NULL, NULL, NULL, '/files/images/a6f0d333-2900-4795-8248-49b647f66474.jpg', 0, '', NULL),
(3, '2026-04-08 11:02:06.941248', '2026-04-08', '2026-04-16', 'qwertyuiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiooooohgiujkbkjbjb;', 0.00, 1000000.00, 'EN_COURS', 'champ de cacao', 'EQUITY', 2, b'1', 'Environnement', NULL, 40.00, NULL, '/files/images/ea33902d-0267-44e1-ab52-e55484ff0585.jpg', 0, '', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `project_steps`
--

DROP TABLE IF EXISTS `project_steps`;
CREATE TABLE IF NOT EXISTS `project_steps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_completed` bit(1) DEFAULT NULL,
  `progress` int DEFAULT NULL,
  `titre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpini6wh9093vsmafjwg00hv0g` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `score_affinite` float DEFAULT NULL,
  `projet_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqlg0qtk1sk4o141hrurhpya5j` (`projet_id`),
  KEY `FK3c9w1lipqdutm65a9inevwfp0` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `repayment_schedule`
--

DROP TABLE IF EXISTS `repayment_schedule`;
CREATE TABLE IF NOT EXISTS `repayment_schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `remaining_principal` decimal(15,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `due_date` date NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `principal_amount` decimal(15,2) DEFAULT NULL,
  `interest_amount` decimal(15,2) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `installment_number` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` bigint NOT NULL,
  `penalty_amount` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjccgjcb6i8sdi7d2ocxmshrh` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
CREATE TABLE IF NOT EXISTS `rewards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci,
  `minimum_amount` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `titre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `estimated_delivery` date DEFAULT NULL,
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reserved_quantity` int DEFAULT NULL,
  `delivery_status` enum('EN_PREPARATION','EXPEDIE','LIVRE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrrrtept7abtiqxlnx2ntq23he` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('CONFIRMER','ECHOUER','EN_ATTENTE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('INVESTISSEMENT','REMBOURSEMENT','RETRAIT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `amount_xaf` decimal(15,2) DEFAULT NULL,
  `source_amount` decimal(15,2) DEFAULT NULL,
  `source_currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqwv7rmvc8va8rep7piikrojds` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','CONTRIBUTEUR','PORTEUR_PROJET') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','DELETED','SUSPENDED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kyc_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_ovh8xmu9ac27t18m56gri58i1` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `address`, `bio`, `created_at`, `email`, `password`, `last_name`, `first_name`, `role`, `status`, `phone`, `preferred_category`, `ville`, `avatar_url`, `google_id`, `kyc_status`, `admin_notes`) VALUES
(1, 'logbessou', 'query all', '2026-03-18 11:24:57.118895', 'kamguemmckevin@gmal.com', '$2a$10$VL.Cg/iBOLCIXf3ieXes7e8PTLrtlu9/fxd/kkQ0fFUnNoPMgpC5m', 'Doe j', 'John', 'CONTRIBUTEUR', 'ACTIVE', '654321234', '', 'Douala', NULL, NULL, NULL, NULL),
(2, 'logbessou entrée cimetiere', 'smart boy', '2026-03-25 05:03:20.656874', 'kamguemmckevin@gmail.com', '$2a$10$VL.Cg/iBOLCIXf3ieXes7e8PTLrtlu9/fxd/kkQ0fFUnNoPMgpC5m', 'Mck', 'sorel Mck', 'PORTEUR_PROJET', 'ACTIVE', '658040002', '', 'DOUALA V', NULL, NULL, 'APPROVED', NULL),
(3, NULL, '', '2026-03-26 03:09:11.741265', 'admin@crowdfund.cm', '$2a$10$VL.Cg/iBOLCIXf3ieXes7e8PTLrtlu9/fxd/kkQ0fFUnNoPMgpC5m', 'Admin', 'Super', 'ADMIN', 'ACTIVE', '658040002', NULL, NULL, NULL, NULL, 'APPROVED', NULL),
(4, NULL, NULL, '2026-04-02 02:51:25.081807', 'avenger.arow@gmail.com', '$2a$10$VL.Cg/iBOLCIXf3ieXes7e8PTLrtlu9/fxd/kkQ0fFUnNoPMgpC5m', 'arow', 'avenger', 'CONTRIBUTEUR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, 'REJECTED', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsswfdl9fq40xlkove1y5kc7kv` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `wallets`
--

INSERT INTO `wallets` (`id`, `created_at`, `balance`, `user_id`) VALUES
(1, '2026-03-18 11:24:57.310335', 0.00, 1),
(2, '2026-03-25 05:03:21.103593', 0.00, 2),
(3, '2026-04-02 02:51:25.187980', 0.00, 4);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ai_analysis`
--
ALTER TABLE `ai_analysis`
  ADD CONSTRAINT `FK6fe4ohj7me96g857lugg9dte5` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKgkoamotsfr3mc0pwa1qrrmwhi` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `contributions`
--
ALTER TABLE `contributions`
  ADD CONSTRAINT `FK4qcv0c1wgs0m7vwo4pwyvel3i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKlcho2lx4i4t2iqrnd1tn4luir` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `FKrjintlln7qilgptci8fxf1rey` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`);

--
-- Contraintes pour la table `equity_details`
--
ALTER TABLE `equity_details`
  ADD CONSTRAINT `FK81qso88tpvvlvd02jdf41gegd` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `interactions`
--
ALTER TABLE `interactions`
  ADD CONSTRAINT `FK3en1u622jlvp97u4p5q93qyom` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKqaybusrum207xjihpnruafc19` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD CONSTRAINT `FKllb8bcbbyo994afdepf7f7j63` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `litiges`
--
ALTER TABLE `litiges`
  ADD CONSTRAINT `FKdvwixx66f3iiy752j66oohiw0` FOREIGN KEY (`accuse_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKe4qwarwgm1p8h4p148ro9np5y` FOREIGN KEY (`plaignant_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKtfuhtxb1mbn342vuriug4niyy` FOREIGN KEY (`projet_concerne_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `loan_details`
--
ALTER TABLE `loan_details`
  ADD CONSTRAINT `FK3w46hfd30p1y87vek9s8d3qd0` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKiasav0fqhcy7ghjy0rwyh9ydn` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `otp_tokens`
--
ALTER TABLE `otp_tokens`
  ADD CONSTRAINT `FKjyk2kyj8ul2bjqjpentlrpyi1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `FKmueqy6cpcwpfl8gnnag4idjt9` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `project_steps`
--
ALTER TABLE `project_steps`
  ADD CONSTRAINT `FKpini6wh9093vsmafjwg00hv0g` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `FK3c9w1lipqdutm65a9inevwfp0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKqlg0qtk1sk4o141hrurhpya5j` FOREIGN KEY (`projet_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `repayment_schedule`
--
ALTER TABLE `repayment_schedule`
  ADD CONSTRAINT `FKjccgjcb6i8sdi7d2ocxmshrh` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `FKrrrtept7abtiqxlnx2ntq23he` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `FKqwv7rmvc8va8rep7piikrojds` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `FKc1foyisidw7wqqrkamafuwn4e` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

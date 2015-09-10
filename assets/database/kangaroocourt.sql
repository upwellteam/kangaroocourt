/* USE db-name */

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `Arguments` (
  `id` int(11) NOT NULL,
  `role` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `argument` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Comments` (
  `id` int(11) NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Disputes` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `imgUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `activeUntil` datetime NOT NULL,
  `bet` int(10) unsigned NOT NULL,
  `isPrivate` tinyint(1) NOT NULL,
  `defendantEmail` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DefendantId` int(11) DEFAULT NULL,
  `PlaintiffId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `DisputesPhotos` (
  `id` int(11) NOT NULL,
  `basename` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `filename` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `absolutePath` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Evidence` (
  `id` int(11) NOT NULL,
  `basename` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `filename` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `absolutePath` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UploaderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Intros` (
  `id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Invitations` (
  `id` int(11) NOT NULL,
  `type` enum('jury','defendant') COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Juries` (
  `id` int(11) NOT NULL,
  `side` enum('plaintiff','defendant') COLLATE utf8_unicode_ci NOT NULL,
  `vote` enum('plaintiff','defendant') COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `InviteId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `RefreshTokens` (
  `id` int(11) NOT NULL,
  `access` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `refresh` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `imgUrl` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `Arguments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `Comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `Disputes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DefendantId` (`DefendantId`),
  ADD KEY `PlaintiffId` (`PlaintiffId`);

ALTER TABLE `DisputesPhotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`);

ALTER TABLE `Evidence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`),
  ADD KEY `UploaderId` (`UploaderId`);

ALTER TABLE `Intros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `Invitations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`);

ALTER TABLE `Juries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DisputeId` (`DisputeId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `InviteId` (`InviteId`);

ALTER TABLE `RefreshTokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `imgUrl` (`imgUrl`);


ALTER TABLE `Arguments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Disputes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `DisputesPhotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Evidence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Intros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Juries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `RefreshTokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Arguments`
  ADD CONSTRAINT `Arguments_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Arguments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Comments`
  ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Disputes`
  ADD CONSTRAINT `Disputes_ibfk_1` FOREIGN KEY (`DefendantId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Disputes_ibfk_2` FOREIGN KEY (`PlaintiffId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `DisputesPhotos`
  ADD CONSTRAINT `DisputesPhotos_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Evidence`
  ADD CONSTRAINT `Evidence_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Evidence_ibfk_2` FOREIGN KEY (`UploaderId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Intros`
  ADD CONSTRAINT `Intros_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Invitations`
  ADD CONSTRAINT `Invitations_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Juries`
  ADD CONSTRAINT `Juries_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Juries_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Juries_ibfk_3` FOREIGN KEY (`InviteId`) REFERENCES `Invitations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `RefreshTokens`
  ADD CONSTRAINT `RefreshTokens_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
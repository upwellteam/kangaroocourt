/* USE db-name */

-- phpMyAdmin SQL Dump
-- version 4.5.0-dev
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 23, 2015 at 02:51 PM
-- Server version: 5.5.43-0ubuntu0.14.10.1
-- PHP Version: 5.5.12-2ubuntu4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `kangaroo`
--

-- --------------------------------------------------------

--
-- Table structure for table `Arguments`
--

CREATE TABLE IF NOT EXISTS `Arguments` (
  `id` int(11) NOT NULL,
  `role` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `argument` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Disputes`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `Juries`
--

CREATE TABLE IF NOT EXISTS `Juries` (
  `id` int(11) NOT NULL,
  `vote` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UserInvitations`
--

CREATE TABLE IF NOT EXISTS `UserInvitations` (
  `id` int(11) NOT NULL,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `code` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `imgUrl` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Arguments`
--
ALTER TABLE `Arguments`
ADD PRIMARY KEY (`id`),
ADD KEY `DisputeId` (`DisputeId`),
ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Disputes`
--
ALTER TABLE `Disputes`
ADD PRIMARY KEY (`id`),
ADD KEY `DefendantId` (`DefendantId`),
ADD KEY `PlaintiffId` (`PlaintiffId`);

--
-- Indexes for table `Juries`
--
ALTER TABLE `Juries`
ADD PRIMARY KEY (`id`),
ADD KEY `DisputeId` (`DisputeId`),
ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `UserInvitations`
--
ALTER TABLE `UserInvitations`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`),
ADD UNIQUE KEY `imgUrl` (`imgUrl`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Arguments`
--
ALTER TABLE `Arguments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Disputes`
--
ALTER TABLE `Disputes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Juries`
--
ALTER TABLE `Juries`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `UserInvitations`
--
ALTER TABLE `UserInvitations`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Arguments`
--
ALTER TABLE `Arguments`
ADD CONSTRAINT `Arguments_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Arguments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Disputes`
--
ALTER TABLE `Disputes`
ADD CONSTRAINT `Disputes_ibfk_1` FOREIGN KEY (`DefendantId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Disputes_ibfk_2` FOREIGN KEY (`PlaintiffId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Juries`
--
ALTER TABLE `Juries`
ADD CONSTRAINT `Juries_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Juries_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

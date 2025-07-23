-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 23, 2025 at 04:28 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_astronacci_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250721124157-create-users.js');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `membershipType` enum('A','B','C') NOT NULL DEFAULT 'A',
  `provider` enum('manual','google','facebook') NOT NULL DEFAULT 'manual',
  `socialId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `phoneNumber`, `password`, `membershipType`, `provider`, `socialId`, `createdAt`, `updatedAt`) VALUES
(1, 'Dwiky S', 'dwikysahut@gmail.com', '-', NULL, 'B', 'facebook', '31041201185465047', '2025-07-23 03:17:16', '2025-07-23 14:18:43'),
(2, 'ddd', 'ddd@gmail.com', '123123123', '$2b$06$F44yj9N9ERgL9JNLW5OIP.75kF7ZUO1tU3lw4ZNDZ6HgqsWe9vgUK', 'A', 'manual', NULL, '2025-07-23 03:22:01', '2025-07-23 03:22:01'),
(3, 'hutomo satria', 'dwikysatriahut@gmail.com', '-', NULL, 'C', 'google', '104462243197953549831', '2025-07-23 07:40:22', '2025-07-23 07:40:22'),
(4, 'dwiky', 'dwiky@gmail.com', '123123123123', '$2b$06$KBFxXfy06oYRT.HUCaaeNevDM6saPizoMdLbOUdYrojzXesLG5jIC', 'A', 'manual', NULL, '2025-07-23 14:03:05', '2025-07-23 14:03:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

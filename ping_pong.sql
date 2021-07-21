-- phpMyAdmin SQL Dump
-- version 4.9.7deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 21, 2021 at 02:08 PM
-- Server version: 8.0.25-0ubuntu0.21.04.1
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ping_pong`
--

-- --------------------------------------------------------

--
-- Table structure for table `games_played`
--

CREATE TABLE `games_played` (
  `id` int NOT NULL,
  `p1_id` int NOT NULL,
  `p2_id` int NOT NULL,
  `p1_score` int NOT NULL,
  `p2_score` int NOT NULL,
  `date_played` datetime NOT NULL,
  `winner_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `games_played`
--

INSERT INTO `games_played` (`id`, `p1_id`, `p2_id`, `p1_score`, `p2_score`, `date_played`, `winner_id`) VALUES
(1, 1, 2, 5, 0, '2021-07-09 12:49:53', 1),
(7, 1, 2, 1, 5, '2021-07-15 15:45:52', 2),
(10, 4, 1, 5, 2, '2021-07-19 09:38:06', 4),
(11, 4, 62, 2, 5, '2021-07-19 09:38:12', 62),
(12, 2, 1, 5, 0, '2021-07-19 09:55:51', 2),
(14, 1, 4, 7, 2, '2021-07-19 11:06:42', 1),
(16, 1, 62, 0, 5, '2021-07-20 13:30:10', 62),
(17, 1, 2, 2, 5, '2021-07-20 16:35:13', 2);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int NOT NULL,
  `ime` varchar(256) NOT NULL,
  `prezime` varchar(256) NOT NULL,
  `datum_rodenja` date NOT NULL,
  `is_deleted` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `ime`, `prezime`, `datum_rodenja`, `is_deleted`) VALUES
(1, 'Mario', 'Benkovic', '1993-06-11', 0),
(2, 'Bono', 'Music', '1995-08-12', 0),
(4, 'Darjan', 'Crncic', '1995-08-12', 0),
(62, 'Ivica', 'Katic', '2021-07-02', 0),
(70, 'Ivica', 'dasd', '2021-07-01', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `games_played`
--
ALTER TABLE `games_played`
  ADD PRIMARY KEY (`id`),
  ADD KEY `p1_id` (`p1_id`),
  ADD KEY `p2_id` (`p2_id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `games_played`
--
ALTER TABLE `games_played`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `games_played`
--
ALTER TABLE `games_played`
  ADD CONSTRAINT `games_played_ibfk_1` FOREIGN KEY (`p1_id`) REFERENCES `players` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `games_played_ibfk_2` FOREIGN KEY (`p2_id`) REFERENCES `players` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

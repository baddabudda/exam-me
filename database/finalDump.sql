-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: webdb
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academgroups`
--

DROP TABLE IF EXISTS `academgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academgroups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `program_id` int NOT NULL,
  `group_admin` int NOT NULL,
  `group_name` varchar(45) NOT NULL,
  `course` int NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `group_admin_UNIQUE` (`group_admin`),
  KEY `FK_groupFaculty` (`faculty_id`),
  KEY `FK_groupProgram` (`program_id`),
  KEY `FK_groupAdmin` (`group_admin`),
  CONSTRAINT `FK_groupAdmin` FOREIGN KEY (`group_admin`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_groupFaculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`),
  CONSTRAINT `FK_groupProgram` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`),
  CONSTRAINT `CHK_course` CHECK ((`course` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academgroups`
--

LOCK TABLES `academgroups` WRITE;
/*!40000 ALTER TABLE `academgroups` DISABLE KEYS */;
INSERT INTO `academgroups` VALUES (19,1,1,6,'20.Б12-пу',3,NULL),(20,2,2,2,'s',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm91cF9pZCI6IjIwIiwiaWF0IjoxNjcxOTk5NjQ1LCJleHAiOjE2NzIwMTc2NDV9.1IWA73o8i-9Vb4RxW15rD-acxR5DS0dss6vkQQj9Z0g');
/*!40000 ALTER TABLE `academgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `faculty_id` int NOT NULL AUTO_INCREMENT,
  `faculty_name` varchar(255) NOT NULL,
  PRIMARY KEY (`faculty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1,'Факультет Прикладной математики - процессов управления'),(2,'Математико-механический факультет');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `list_id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `list_name` varchar(255) NOT NULL,
  `is_public` tinyint NOT NULL,
  `semester` int NOT NULL,
  PRIMARY KEY (`list_id`),
  KEY `FK_listGroup` (`group_id`),
  KEY `FK_listSubject` (`subject_id`),
  CONSTRAINT `FK_listGroup` FOREIGN KEY (`group_id`) REFERENCES `academgroups` (`group_id`),
  CONSTRAINT `FK_listSubject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `CHK_public` CHECK (((`is_public` = 1) or (`is_public` = 0))),
  CONSTRAINT `CHK_sem` CHECK (((`semester` > 0) and (`semester` < 10)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (5,19,1,'Математическая логика (весна 2022)',0,4),(6,19,2,'Экзамен по алгему (1 курс)',0,1),(7,19,13,'ТФКП 3 курс осенний семестр 2022г.',1,5),(8,20,11,'kjukug',0,1);
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) NOT NULL,
  PRIMARY KEY (`program_id`),
  UNIQUE KEY `UC_progname` (`program_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` VALUES (2,'Прикладная математика, фундаментальная информатика и программирование'),(1,'Программирование и информационные технологии');
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `list_id` int NOT NULL,
  `edit_date` timestamp NOT NULL,
  `question_order` int NOT NULL,
  `question_title` varchar(255) NOT NULL,
  `question_body` mediumtext NOT NULL,
  `is_deleted` tinyint NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `FK_listid_idx` (`list_id`),
  CONSTRAINT `FK_listid` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (6,8,'2022-12-25 17:20:20',1,'jyvkuhkug','<p>hf,gfjygkugyf,uk</p>',0);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(255) NOT NULL,
  PRIMARY KEY (`subject_id`),
  UNIQUE KEY `UC_subjname` (`subject_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (2,'Алгебра и геометрия'),(4,'Алгоритмы и анализ сложности'),(11,'Базы данных'),(7,'Компьютерная графика'),(12,'Кратные интегралы и ряды'),(1,'Математическая логика и теория алгоритмов'),(3,'Математический анализ'),(5,'Теория управления'),(13,'Теория функций комплексного переменного'),(14,'Язык эффективной коммуникации'),(16,'Язык эффективной коммуникации-1');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `vk_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `user_fname` varchar(45) NOT NULL,
  `user_lname` varchar(45) NOT NULL,
  `user_pname` varchar(45) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `vk_id_UNIQUE` (`vk_id`),
  KEY `FK_userGroup` (`group_id`),
  CONSTRAINT `FK_userGroup` FOREIGN KEY (`group_id`) REFERENCES `academgroups` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,35540181,20,'Ирина','Радькова','Тимофеевна',1),(5,327121430,NULL,'Сергей','Павлов',NULL,1),(6,187634225,19,'Елена','Борисова','Александровна',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `versioned`
--

DROP TABLE IF EXISTS `versioned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `versioned` (
  `version_id` int NOT NULL AUTO_INCREMENT,
  `edit_date` timestamp NOT NULL,
  `list_id` int NOT NULL,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `question_title` varchar(255) NOT NULL,
  `question_body` mediumtext NOT NULL,
  PRIMARY KEY (`version_id`,`question_id`),
  KEY `FK_versionList` (`list_id`),
  KEY `FK_versionUser` (`user_id`),
  KEY `FK_versionQuestion` (`question_id`),
  CONSTRAINT `FK_versionList` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`),
  CONSTRAINT `FK_versionQuestion` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  CONSTRAINT `FK_versionUser` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `versioned`
--

LOCK TABLES `versioned` WRITE;
/*!40000 ALTER TABLE `versioned` DISABLE KEYS */;
INSERT INTO `versioned` VALUES (6,'2022-12-25 17:18:22',8,2,6,'jyvkuhkug',' '),(7,'2022-12-25 17:20:20',8,2,6,'jyvkuhkug','<p>hf,gfjygkugyf,uk</p>');
/*!40000 ALTER TABLE `versioned` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-26 19:13:17

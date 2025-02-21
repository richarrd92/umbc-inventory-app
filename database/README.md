# MariaDB Setup Guide

This project uses **MariaDB** for database management.  
Each developer runs **their own local instance** of MariaDB, meaning:
- Everyone installs MariaDB on their own machine.
- The database schema (`schema.sql`) must be applied manually.
- each developer is responsible for maintaining their local database.

---

## **1️. Installing MariaDB**
### **Ubuntu / WSL**
```sh
sudo apt update
sudo apt install mariadb-server mariadb-client -y
```

### **MacOS (Homebrew)**
(Please update MacOS instructions if needed)
```sh
brew install mariadb
brew services start mariadb
```

## **2. Starting and stopping the database**
### **Start Mariadb:**
```sh
sudo service mariadb start
```
### **stop Mariadb:**
```sh
sudo service mariadb stop
```
### **check if running:**
```sh
sudo service mariadb status
```

## **3. Setting up the `inventory` database**
Each developer must create the database **locally**.
### **1. Open mariadb:**
```sh
mysql -u root -p
```
(Enter your MariaDB root password)
Output should show something like: 
```sh
MariaDB [(none)]>
```

### **2. Create `inventory` database:**
```sh
CREATE DATABASE inventory;
SHOW DATABASES;
EXIT;
```
You should see the database in your list something like this:
```sh
MariaDB [(none)]> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| inventory          |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.001 sec)
```

## **4. Applying database schema** (TBD)
- `schema.sql` will setup initial db structure



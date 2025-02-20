# REIA-2: Database Selection – Choosing MariaDB for Inventory Tracking  

## Summary  
This PR explains the decision to use **MariaDB** as the database for our inventory tracking system. MariaDB is **lightweight**, compatible with **mySQL** and **open-source** that meets our current project requirements. It supports **transaction management, indexing, and foreign key constraints**, making it good for tracking food inventory, item withdrawals, and basic demand trends.  

Since this will be a **demo** with a limited dataset, I think it is a good choice for now because it is easy to setup and should integrate with other tools just fine. 

---

### **Key benefits for the inventory app**
1. **Allows structured relational data** which is good for the defining relationships between users and transactions for example
2. **Ensures data integrity** because transactions have ACID compliance (for example it won't allow errors with stock levels of items)
3. **Allows for basic analytics** (tracking food withdrawals over time).  

---

## 📊 Example Queries for Inventory Tracking  

### **Tracking Total Food Withdrawals by Item**
```sql
SELECT item_id, SUM(quantity) AS total_taken
FROM transactions
WHERE transaction_type = 'checkout'
GROUP BY item_id
ORDER BY total_taken DESC;
```
This will help identify the most frequently taken food items, for example.

### **Checking most active days**
```sql
SELECT DAYNAME(transaction_date) AS day_of_week, COUNT(*) AS total_transactions
FROM transactions
GROUP BY day_of_week
ORDER BY total_transactions DESC;
```
### **Other alternatives**
I also considered PostgreSQL because stronger analytics (especially for seeing demand trends), better long-term scalability, and time-series support. But I think for this project’s scope, these features are not necessary at the moment and MariaDB is simpler and easier to manage for small data.
If analytics or scaling needs grow significantly, we can always reassess PostgreSQL in the future

This is open for **review** and **feedback**. Please **confirm** that MariaDB is the best choice for our use case. Thanks!



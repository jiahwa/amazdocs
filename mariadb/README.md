grammar
```sql
mysql -u root -p<your pswd>

use wordpress;

show tables;

select * from wp_options where option_name = "upload_path";

update wp_options set option_value = "wp-content/uploads" where option_name = "upload_path";

chmod -R a+w wp-content/uploads

```
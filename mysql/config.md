```
[Unit]
Description=MySQL 5.7.28 Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target

[Install]
WantedBy=multi-user.target

[Service]
User=mysql
Group=mysql
ExecStart=/var/lib/mysql-5.7.28/bin/mysqld --defaults-file=/var/lib/mysql-5.7.28/my.cnf
LimitNOFILE = 5000
#Restart=on-failure
#RestartPreventExitStatus=1
#PrivateTmp=false

```
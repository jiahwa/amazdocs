```sh
 yum -y install numactl

./bin/mysqld --defaults-file=/var/lib/mysql-5.7.28/my.cnf --basedir=/var/lib/mysql-5.7.28 --datadir=/var/lib/mysql-5.7.28/data --user=mysql --initialize

```
install password

2021-08-01T06:34:13.793635Z 1 [Note] A temporary password is generated for root@localhost: wh+1O;GjK<6h

```sh
./bin/mysqld --defaults-file=/var/lib/mysql-5.7.28/my.cnf --user=root&
```

/var/lib/mysql-5.7.28/bin/mysqld --daemonize --defaults-file=/var/lib/mysql-5.7.28/my.cnf

pid-file=/var/lib/mysql-5.7.28/data/VM-0-12-centos.pid



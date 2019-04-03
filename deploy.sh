rsync -Pav -e 'ssh -i ~/.ssh/id_rsa' --delete -r src/ root@120.132.8.152:/var/www/html/webqrcode/src
rsync -Pav -e 'ssh -i ~/.ssh/id_rsa' --delete -r package.json root@120.132.8.152:/var/www/html/webqrcode
rsync -Pav -e 'ssh -i ~/.ssh/id_rsa' --delete -r server.js root@120.132.8.152:/var/www/html/webqrcode
rsync -Pav -e 'ssh -i ~/.ssh/id_rsa' --delete -r server.cer root@120.132.8.152:/var/www/html/webqrcode
rsync -Pav -e 'ssh -i ~/.ssh/id_rsa' --delete -r server.key root@120.132.8.152:/var/www/html/webqrcode
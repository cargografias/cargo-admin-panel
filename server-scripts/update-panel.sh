ssh cargoadmin@104.131.103.212 "
    cd /opt/panel
    pm2 stop panel
    git pull
    npm install
    bower install
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > public/version.txt 
    pm2 restart panel
"

ssh admin@panel-lab.cargografias.org "
    cd /opt/panel-lab
    pm2 stop panel-lab
    git pull
    npm install
    bower install
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > public/version.txt 
    pm2 restart panel-lab
"

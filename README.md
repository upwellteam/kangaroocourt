# Installation Guide

### Requirements:

*  io.js (1.6.*)
*  MySQL (5.5+)
*  Bower
*  Gulp

### Installation
```bash
git clone https://github.com/upwellteam/kangaroocourt.git
cd ./kangaroocourt
npm install 
bower install
gulp install
gulp configure
gulp database
```

### Development
```bash
DEBUG=kangaroo:* node ./server.js
```

To automatically recompile sources during development run:
```bash
gulp watch
```


Gulp tasks available:

 name | description
 --- | ---
js | Compile JS
js-app | Concat and minify all application scripts
js-libs | Concat and minify 3rd parties scripts
less | Compile LESS
jade | Compile JADE
copy-fonts | Copy fonts into `/public`
install | Run all tasks above
configure | Configuration
database | Create Database and Sync

### .env example
```
ENV     =   development
PORT    =   3000
DOMAIN     =   http://kangaroo.loc:3000/

FACEBOOK_CLIENT_ID =
FACEBOOK_REDIRECT_URI =
FACEBOOK_CLIENT_SECRET =

MANDRILL_API_KEY =
```
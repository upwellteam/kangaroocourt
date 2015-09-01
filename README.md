### Requirements:

*  io.js (1.6.*)
*  MySQL (5.5+)
*  Bower
*  Gulp

### Installation Guide
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
To run app with DEBUG:
```bash
DEBUG=kangaroo:* node ./server.js
```
To automatically run app with debug you should do this:
open ~/.bashrc
and put this at the very end
```
export DEBUG=kangaroo : *
```
then relogin and use following command to run app
```bash
node ./server.js
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
copy-fonts | Copy fonts into `/dist/fonts`
copy-images | Copy images into `/dist/images`
install | Run all tasks above
configure | Configuration
database | Create Database and Sync

### .env example
```
ENV                     = development
PORT                    = 3000
DOMAIN                  = http://localhost:3000/

REDISTOGO_URL           = redis://localhost:6379/
REDIS_TOKEN_LIFETIME    = 3600

MYSQL_USERNAME          = root
MYSQL_PASSWORD          = 123456789
MYSQL_HOST              = localhost
MYSQL_DATABASE          = kangaroocourt
MYSQL_PORT              = 3306

SALT                    = be00a6bd2069bdb9be2196938886d1ee
UPLOAD_DIR              = ./uploads/
MAX_EVIDENCE            = 3

FACEBOOK_ID             =
FACEBOOK_SECRET         =
FACEBOOK_URI            =

MANDRILL_API_KEY        =
```

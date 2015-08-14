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
copy-fonts | Copy fonts into `/dist/fonts`
copy-images | Copy images into `/dist/images`
install | Run all tasks above
configure | Configuration
database | Create Database and Sync

### .env example
```
ENV                     = development
PORT                    = 3000
DOMAIN                  = http://kangaroocourt.loc:3000/

REDISTOGO_URL           = redis://localhost:6379/
REDIS_TOKEN_LIFETIME    = 3600

MYSQL_USERNAME          = root
MYSQL_PASSWORD          = 123456789
MYSQL_HOST              = localhost
MYSQL_DATABASE          = kangaroocourt
MYSQL_PORT              = 3306

SALT                    =
UPLOAD_DIR              = kangaroocourt/uploads/

FACEBOOK_ID             =
FACEBOOK_SECRET         =
FACEBOOK_URI            =

MANDRILL_API_KEY        =
```
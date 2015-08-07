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

### Run
```bash
DEBUG=kangaroo:* node ./server.js
```
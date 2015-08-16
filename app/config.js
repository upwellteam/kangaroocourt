var url = require('url');

var rtg = url.parse(process.env.REDISTOGO_URL);

var config = {
    salt : process.env.SALT,
    uploadDir : process.env.UPLOAD_DIR,
    mysql : {
        username : process.env.MYSQL_USERNAME,
        password : process.env.MYSQL_PASSWORD,
        host : process.env.MYSQL_HOST,
        port : process.env.MYSQL_PORT,
        database : process.env.MYSQL_DATABASE
    },
    redis : {
        url : process.env.REDISTOGO_URL,
        host : rtg.hostname,
        port : rtg.port,
        password : rtg.auth ? rtg.auth.split(":")[1] : null,
        lifetime : process.env.REDIS_TOKEN_LIFETIME
    },
    mandrill : {
        key : process.env.MANDRILL_API_KEY
    },
    facebook : {
        client_id : process.env.FACEBOOK_ID,
        client_secret : process.env.FACEBOOK_SECRET,
        redirect_uri : process.env.FACEBOOK_URI
    }
};

module.exports = config;
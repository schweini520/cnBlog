module.exports = {
  apps : [{
    name: 'blog_server',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      WLINK_SVC: 'localtest',
      DB: "mongodb://192.168.16.188/testdb",
      REDIS: [{"port": 7000, "host": "localhost"}, {"port": 7001, "host": "localhost"},{"port": 7002, "host": "localhost"}],
      JWT_SECRET: "15567b09-88d2-45ba-9ddc-00314dde41a9",
      LOG_PATH: "logs",
      LOG_LEVEL: "debug"
    },
    env_testing: {
      NODE_ENV: 'testing',
      WLINK_SVC: 'localtest',
      DB: "mongodb://127.0.0.1:27017/wlink",
      REDIS: [{"port": 7000, "host": "localhost"}, {"port": 7001, "host": "localhost"},{"port": 7002, "host": "localhost"}],
      ONLINE_SESSION_TIME: 576,
      LOG_PATH: "logs",
      LOG_LEVEL: "debug"
    },
    env_production: {
      NODE_ENV: 'production',
      WLINK_SVC: 'localtest',
      DB: "mongodb://172.26.9.73:27017,172.26.3.26:27017,172.26.40.122:27017/wlink",
      REDIS: [{"port": 7379, "host": "172.26.9.73"}, {"port": 7379, "host": "172.26.3.26"},{"port": 7379, "host": "172.26.40.122"}],
      ONLINE_SESSION_TIME: 576,
      LOG_PATH: "logs",
      LOG_LEVEL: "debug"
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : ['api1.wavlink.xyz', 'api2.wavlink.xyz'],
      ref  : '/master',
      repo : 'https://github.com/wzone001/cnBlog',
      path : '/home/ubuntu/zhuwei/wlink_wsock',
      ssh_options: ['ForwardAgent=yes'],
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env production'
    },
    testing : {
      user : 'root',
      host : '45.32.52.128',
      ref  : '/master',
      repo : 'https://github.com/wzone001/cnBlog',
      path : '/root/blog',
      ssh_options: ['ForwardAgent=yes'],
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env testing'
    },
    staging: {
      user : 'kobe',
      host : '192.168.16.188',
      ref  : '/master',
      repo : 'https://github.com/wzone001/cnBlog',
      path : '/home/kobe/schweini/share/nodejs/blog',
      ssh_options: ['ForwardAgent=yes'],
      'post-deploy' : 'pm2 reload ecosystem.config.js --env development'
    },
    dev: {}
  } 
};

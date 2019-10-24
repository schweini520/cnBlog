var express = require('express');
var moment = require('moment-timezone');
var mongoose = require('./../database');
var userInfo = require('./../models/userInfoSche');
var articlesInfo = require('./../models/articles');
var router = express.Router();

/* GET home page.博客首页 */
router.get('/', function (req, res, next) {
  var page = req.query.page || 1;
  var start = (page - 1) * 8;
  var end = page * 8;
  var queryCount;
  
  articlesInfo.find({},  function (err, articles) {
    queryCount = articles.length;
  });

  articlesInfo.find({"articleID":{"$gt":start,"$lte":end}}, null, {sort: {'_id': -1}}, function (err, articles) {
    if (err) {
      console.log("findOne err : " + err);
      return;
    }
    if (articles == null) {
      res.status(403).send("Bad Request.");
      //res.render('', {message:'error msg'});
      return;
    } else {
      //res.status(200).send("OK.");
      console.log("findAll articles : " + articles.length);
      //res.render("index", { articles: articles, user:req.session.user });
      var pageNum = Math.ceil(queryCount / 8);
      console.log("findAll articles : pageNum " + pageNum);
      res.render("index", { articles: articles, user:req.session.user, pageNum:pageNum, page:page });
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('login', { message: '' });
});

//文章详情请求
router.get('/articles/:articleID', function (req, res, next) {
  var articleID = req.params.articleID;
  var user = req.session.user;
  console.log("ID = " + articleID);
  articlesInfo.findOne({ "articleID": articleID }, function (err, articles) {
    if (err) {
      console.log("findOne err : " + err);
      return;
    }
    if (articles == null) {
      res.status(403).send("Bad Request.");
      //res.render('', {message:'error msg'});
      return;
    } else {
      //res.status(200).send("OK.");
      console.log("findAll articles : " + articles.articleTime);
      articles.articleClick = articles.articleClick + 1;
      articles.save();
      res.render("article", { articles: articles, user: user });
    }
  });
});

//文章编辑请求
router.get('/modify/:articleID', function(req, res, next) {
  var articleID = req.params.articleID;
  var user = req.session.user;

  if (!user) {
    res.redirect('/login');
    return;
  }
  articlesInfo.findOne({ "articleID": articleID }, function (err, articles) {
    if (err) {
      console.log("findOne err : " + err);
      return;
    }

    if (articles == null) {
      res.status(403).send("Bad Request.");
      return;
    } else {
      res.render("modify", { user: user, title: articles.articleTitle, content: articles.articleContent });
    }
  });
});

//文章编辑后的保存请求
router.post('/modify/:articleID', function(req, res, next) {
  var articleID = req.params.articleID;
  var user = req.session.user;
  var title = req.body.title;
  var content = req.body.content;

  var update = {$set : { "articleTitle" : title, "articleContent":content }};

  articlesInfo.updateOne({"articleID":articleID}, update, function(error){
    if(error) {
        console.log(error);
        return;
    } else {
        console.log('Update success!');
        res.redirect('/');
    }
  });
});

//删除文章请求
router.get('/delete/:articleID', function(req, res, next) {
  var articleID = req.params.articleID;
  var user = req.session.user;

  if (!user) {
    res.redirect('/login');
    return;
  } else {
    articlesInfo.deleteOne({"articleID":articleID}, function(error) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log("Delete success~!!");
        res.redirect('/');
      }
    });
  }
});

//登录请求--通过session验证
router.post('/login', function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;

  console.log("name = " + name);
  console.log("password = " + password);
  userInfo.findOne({ "name": name, "password": password }, function (err, user) {
    if (err) {
      console.log("findOne err : " + err);
      return;
    }

    if (user == null) {
      //res.status(403).send("Bad Request.");
      res.render('login', { message: 'error msg' });
      return;
    } else {
      //res.status(200).send("OK.");
      req.session.user = user;
      res.redirect('/');
    }
  });
});

//写博客页面
router.get('/edit', function (req, res, next) {
  var today = moment().format();
  console.log(today);
  var user = req.session.user;
  if (!user) {
    res.redirect('/login');
    return;
  }
  res.render('edit', {user:req.session.user});
});

//博客发布请求
router.post('/edit', function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var author = req.session.user.name;
  var today = moment().format();
  var articleID;

  //save_article(title, content, author, today);

  articlesInfo.find({}, function (err, articles) {
    if (err) {
      console.log("findOne err : " + err);
      return;
    }
    //console.log(articles);
    if (articles == null) {
      articleID = 1;
    } else {
      console.log("article.length = " + articles.length);
      articleID = articles.length + 1;

      console.log("articleID = " + articleID);
      var newarticle = new articlesInfo({
        articleTitle: title,
        articleContent: content,
        articleAuthor: author,
        articleTime: today,
        articleClick: 0,
        articleID: articleID
      });

      newarticle.save();

      res.redirect('/');
    }
  });
});

router.get('/friends', function(req, res, next) {
  res.render('friends', {user:req.session.user});
});

router.get('/about', function(req, res, next) {
  res.render('about', {user:req.session.user});
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
})

module.exports = router;

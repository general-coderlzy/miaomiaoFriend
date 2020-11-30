const router = require('koa-router')()
const config = require('../config.js')
const requestPromise = require('request-promise')
const fs = require('fs')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/uploadBannerImg', async (ctx, next) => {

  var files = ctx.request.files;
  var file = files.file;


  try {

    let options = {
      uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
      json: true
    }

    let {
      access_token
    } = await requestPromise(options);

    let fileName = `${Date.now()}.jpg`;
    let filePath = `banner/${fileName}`;

    options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
      body: {
        "env": 'miaomiao-friend-87aby',
        "path": filePath,
      },
      json: true
    }

    let res = await requestPromise(options);
    let file_id = res.file_id;

    options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
      body: {
        "env": 'miaomiao-friend-87aby',
        "query": "db.collection(\"banner\").add({data:{fileId:\"" + file_id + "\"}})"
      },
      json: true
    }

    await requestPromise(options)
    options = {
      method: 'POST',
      uri: res.url,
      formData: {
        "Signature": res.authorization,
        "key": filePath,
        "x-cos-security-token": res.token,
        "x-cos-meta-fileid": res.cos_file_id,
        "file": {
          value: fs.createReadStream(file.path),
          options: {
            filename: fileName,
            contentType: file.type
          }
        }
      }
    }
    await requestPromise(options);

    ctx.body = res;

  } catch (err) {
    console.log(err.stack)
  }

})

module.exports = router
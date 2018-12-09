var express = require('express');
var app = express();
//body parser để sử dụng trong post
var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//end body parser
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');
app.listen(3000);
// setting Pg
var pg = require('pg');
var config = {
    user: 'postgres',
    host: 'localhost',
    database: 'students',
    password: 'taolamin1991',
    port: 5432,
};
const pool = new pg.Pool(config);
        // end setting Pg



// router xem
app.get('/sinhvien/list', function (req,res) {
  //lấy Db
    pool.connect((err, client, done) => {
        if (err) return done(err)
      
        client.query('SELECT * FROM public.sinhvien ORDER BY id ASC', (err, result) => {
          done()
          if (err) {
            res.end();
            return console.error('query error', err)
          }
          //console.log(result.rows[0].name)
          // render ra view
          res.render('sinhvien_list',{danhsach: result});
        });
      });
});

// router thêm
//show form để khách hàng thêm
app.get('/sinhvien/them',function (req,res) {
  res.render('sinhvien_insert')
});
//tải thông tin lên DB
app.post('/sinhvien/them', urlencodedParser, function (req,res) {
  
  //insert vaof Db
  pool.connect((err, client, done) => {
    if (err) return done(err)
    var nameInsert = req.body.nameSv;
    var emailInsert = req.body.emailSv;
    client.query('INSERT INTO public.sinhvien(name, email) values($1, $2)',
    [nameInsert, emailInsert], (err, result) => {
      done()
      if (err) {
        res.end();
        return console.error('query error', err)
      }
      //console.log(result.rows[0].name)
      //res.send(' Insert thành công');
      res.redirect('/sinhvien/list')
    });
  });
});

//router sửa
// hiển thị thông tin sửa
app.get('/sinhvien/sua/:id',function (req,res) {
  //lấy Db
  pool.connect((err, client, done) => {
    if (err) return done(err)
   var id = req.params.id;
    client.query("SELECT * FROM public.sinhvien WHERE id='"+id+"'", (err, result) => {
      done()
      if (err) {
        res.end();
        return console.error('query error', err)
      }
      // render ra view
      //console.log(result.rows[0]);
      res.render('sinhvien_edit',{danhsachEdit: result.rows[0]});
    });
  });
});
//đẩy thông tin đã sửa đi
app.post('/sinhvien/sua', urlencodedParser, function (req,res) {
  
  //insert vaof Db
  pool.connect((err, client, done) => {
    if (err) return done(err)
    var nameInsert = req.body.nameSv;
    var emailInsert = req.body.emailSv;
    var idInsert = req.body.idSv;
    client.query('UPDATE public.sinhvien SET name=($1), email=($2) WHERE id=($3)',
    [nameInsert, emailInsert, idInsert], (err, result) => {
      done()
      if (err) {
        res.end();
        return console.error('query error', err)
      }
      //console.log(result.rows[0].name)
      //res.send(' Insert thành công');
      res.redirect('/sinhvien/list')
    });
  });
})

//router remove
app.get('/sinhvien/xoa/:id', function (req,res) {
  //remove trong Db
  pool.connect((err, client, done) => {
    if (err) return done(err)

    var idRemove = req.params.id;
    client.query('DELETE FROM public.sinhvien WHERE id=($1)',
    [idRemove], (err, result) => {
      done()
      if (err) {
        res.end();
        return console.error('query error', err)
      }
      //console.log(result.rows[0].name)
      //res.send(' Insert thành công');
      res.redirect('/sinhvien/list')
    });
  });
});



app.get('/', function (req, res) {
    res.render('main');
});
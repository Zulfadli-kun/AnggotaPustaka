var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const axios = require('axios');
var Feed = require('rss-to-json');

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password : "",
    database : "digilib"
})

/* GET home page. */
router.get('/', function(req, res, next) {
    con.query("SELECT * FROM koleksionline", function (err, results, field) {
        con.query("SELECT kategori_koleksi FROM `koleksionline`GROUP BY kategori_koleksi", function (elol, kategori) {
            if (err) {
                throw err
            } else {
                if (elol) {
                    throw elol
                }
                else {
                    res.render('index', {
                        title: 'Express',
                        results: results,kategori,
                        usernamo: req.session.user && req.session.user.nama_anggota,
                    })
                }
            }

        })
    })
});

router.post('/search_koleksi',function (req,res,next) {
    var kategori = req.body.category;
    var kata_kunci = req.body.keywords;
    con.query("SELECT * FROM `koleksionline`WHERE nama_koleksi LIKE '%"+kata_kunci+"%' OR kategori_koleksi LIKE '%"+kategori+"%'",function (err, results) {
        con.query("SELECT COUNT(`kategori_koleksi`) as jumlah,`kategori_koleksi` FROM `koleksionline` GROUP BY `kategori_koleksi`", function (elol, kategori) {
            con.query("SELECT COUNT(`penulis_koleksi`) as penulis,`penulis_koleksi` FROM `koleksionline` GROUP BY `penulis_koleksi`", function (rusak, penulis) {
                if (err || elol || rusak) {
                    throw new Error('rusak mas')
                } else {
                    res.render('book', {results: results, kategori, penulis});
                }
            })
        })
    })
});

router.get('/book',function (req,res,next) {
    con.query("SELECT * FROM koleksionline", function (err, results, field) {
        con.query("SELECT COUNT(`kategori_koleksi`) as jumlah,`kategori_koleksi` FROM `koleksionline` GROUP BY `kategori_koleksi`", function (elol, kategori) {
            con.query("SELECT COUNT(`penulis_koleksi`) as penulis,`penulis_koleksi` FROM `koleksionline` GROUP BY `penulis_koleksi`", function (rusak, penulis) {
                if (err || elol || rusak) {
                    throw new Error('rusak mas')
                } else {
                    res.render('book', {results: results, kategori, penulis});
                }
            })
        })
    })
});
router.get('/book/:param',function (req,res,next) {
    console.log(req.params.param)
    con.query("SELECT * FROM koleksionline where `kategori_koleksi` = '"+req.params.param+"'", function (err, results, field) {
        con.query("SELECT COUNT(`kategori_koleksi`) as jumlah,`kategori_koleksi` FROM `koleksionline` GROUP BY `kategori_koleksi`", function (elol, kategori) {
            con.query("SELECT COUNT(`penulis_koleksi`) as penulis,`penulis_koleksi` FROM `koleksionline` GROUP BY `penulis_koleksi`", function (rusak, penulis) {
                if (err || elol || rusak) {
                    throw new Error('rusak mas')
                } else {
                    res.render('book', {results: results, kategori, penulis});
                }
            })
        })
    })
});

router.get('/author/:param',function (req,res,next) {
    console.log(req.params.param)
    con.query("SELECT * FROM koleksionline where `penulis_koleksi` = '"+req.params.param+"'", function (err, results, field) {
        con.query("SELECT COUNT(`kategori_koleksi`) as jumlah,`kategori_koleksi` FROM `koleksionline` GROUP BY `kategori_koleksi`", function (elol, kategori) {
            con.query("SELECT COUNT(`penulis_koleksi`) as penulis,`penulis_koleksi` FROM `koleksionline` GROUP BY `penulis_koleksi`", function (rusak, penulis) {
                if (err || elol || rusak) {
                    throw new Error('rusak mas')
                } else {
                    res.render('book', {results: results, kategori, penulis});
                }
            })
        })
    })
});

router.get ('/book_detail/:param',function (req,res,next) {
    const idparam = req.params.param;
    con.query("SELECT * FROM `koleksionline` WHERE `id_koleksi` ="+idparam,function (err,results,fields) {
        if (err){
            throw err;
        }else{
            let asw = JSON.stringify(results);
            asw = JSON.parse(asw);
            console.log({asw});
            res.render('book_detail',{results:asw})
        }
    })
});

router.get('/News',function (req,res,next) {
    axios.get('https://newsapi.org/v2/top-headlines?country=id&category=technology&apiKey=b86bf584ce6f4fe5b2967369698d32db')
        .then(result => {
            // console.log(result.data);
            res.render('News', {items: result.data.articles});
        });
});

router.get('/modul',function (req,res,next) {
    con.query('SELECT * FROM `daftarmodul`',function (err,results) {
        con.query('SELECT COUNT(kategori_modul) as jumlah,kategori_modul FROM `daftarmodul`',function (elol,kategori) {
        if (err){
            throw err;
        }else {
            console.log(results)
            console.log(kategori)
            res.render('modul',{results:results,kategori},
                )
        }
         })
    })
});

router.get('/modul_search/:param',function (req,res,next) {
    console.log(req.params.param)
    con.query("SELECT * FROM `daftarmodul` where `kategori_modul` = '"+req.params.param+"'", function (err, results, field) {
        con.query("SELECT COUNT(`kategori_modul`) as jumlah,`kategori_modul` FROM `daftarmodul` GROUP BY `kategori_modul`", function (elol, kategori) {

                if (err || elol ) {
                    throw new Error('rusak mas')
                } else {
                    res.render('modul', {results: results, kategori});
                }

        })
    })
});

router.get('/ta',function (req,res,next) {
    res.render('TA')
})

router.get('/berita',function (req,res,next) {
    res.render('berita')
})
router.get('/berita_detail',function (req,res,next) {
    res.render('berita_detai')
})
router.get('/signing',function (req,res,next) {
    res.render('signing')
});

router.post('/action_login',function (req,res,next) {
    var username = req.body.username
    var password = req.body.password
    con.query("SELECT * FROM anggotapustaka WHERE email_anggota ='"+username+"' AND pass_anggota =PASSWORD('"+password+"')",function (err, results, field){
        console.log({ results, err })
        if (err) {
            throw err
        }
        else if (results.length == 0){
            res.redirect('/signing')
        }
        else {
            results[0].pass_anggota = undefined;
            req.session.user = Object.assign({}, results[0]);
            res.redirect('/')
        }
    })
});

router.get('/request',function (req,res,next) {
    var today = new Date()
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    console.log(dateTime)
    res.render('request',{data:dateTime})
});

router.post('/request_book',function (req,res,next) {
    var judul = req.body.judul;
    var edisi =req.body.edisi;
    var seri = req.body.seri;
    var tahun = req.body.tahun;
    var terbit = req.body.terbit;
    var tanggal = req.body.tanggal;
    var status = req.body.status;
    var email = 'maha1@pcr.ac.id'
    console.log(judul,edisi,seri,tahun,terbit,tanggal,status)
    var query = "INSERT INTO `requestbuku`(`email_anggota`, `judul_request`, `edisi_request`," +
        " `seri_request`, `thnterbit_request`, `penerbit_request`, `tgl_request`, `status_request`) " +
        "VALUE ('"+email+"','"+judul+"','"+edisi+"','"+seri+"','"+tahun+"','"+terbit+"','"+tanggal+"','"+status+"')";
    con.query(query, function(error) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('success');
            res.redirect("/request")
        }
    })

})
router.get('/ISBN',function (req,res,next){
con.query("SELECT kategori_koleksi FROM koleksionline",function (err,results) {
    if(err){
        throw err;
    }else{
        let asw = JSON.stringify(results);
        asw = JSON.parse(asw);
        console.log({asw});
        res.render('ISBN',{results:asw})
    }
} )
})
router.post('/isbn_submit',function (req,res,next) {
    var judul = req.body.judul;
    var penerjemah = req.body.penerjemah;
    var edisi = req.body.edisi;
    var seri = req.body.seri;
    var tahun = req.body.tahun;
    var jumlahHal = req.body.jumlahHal;
    var tinggiB = req.body.tinggiB;
    var kategory = req.body.kategory;
    var jenis = req.body.jenis;
    var media = req.body.media;

    res.redirect('/ISBN')

})

router.get('/jurnal',function (req,res,next) {
    Feed.load('https://journal.uny.ac.id/index.php/nominal/gateway/plugin/WebFeedGatewayPlugin/rss2', function(err, rss, field){
        console.log(rss);
        const data = rss.items.map(item => {
            const newDesc = item.description.slice(0, 500);
            item.description = newDesc;
            return item;
        })
        console.log(data);
        res.render('jurnal',{data: data})
    });
});

router.post('/jurnal_search',function (req,res,next) {
    var keywords = req.body.keywords;
    console.log(keywords)
    Feed.load('https://journal.uny.ac.id/index.php/nominal/gateway/plugin/WebFeedGatewayPlugin/rss2', function(err, rss, field){
        // console.log(rss);
        const data = rss.items.map(item => {
            const newDesc = item.description.slice(0, 500);
            item.description = newDesc;
            return item;
        })
        const search = data.filter(d => {
            return keywords.toLowerCase().split(' ').every(kalimat => d.title.toLowerCase().includes(kalimat));
        });
        console.log(search);
        res.render('jurnal',{data: search})
    });
});

router.get('/logout', function (req, res) {
    req.session.user = undefined;
    res.redirect('/');
});
module.exports = router;

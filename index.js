var express=require('express');
var exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
var path = require('path');

const messagebird=require('messagebird')('P0vxyi1NHq06cSGLLkm3tsGWs');

var app=express();
app.set('views', path.join(__dirname, 'views1'));
app.engine('handlebars',exphbr({defaultLayout:false, layoutsDir: "views1"}));
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function (req,res){
        res.render('step1');
})

app.post('/step2',(req,res)=>{
    let number=req.body.number;
    messagebird.verify.create(number,{
        template:"your verifcation is code is %token"
    },(err,resd)=>{
        if(err){
            console.log(err);
            res.render('step1',{
                error:err.errors[0].description
            });

        }else {
            console.log(resd);
            res.render('step2',{
                id:resd.id
            });
        }
    })
})

app.post('/step3',(req,res)=>{
    let id=req.body.id;
    let token=req.body.token;

    messagebird.verify.verify(id,token,(err,red)=>{
        if(err){
            res.render('step2',{
                error:err.errors[0].description,
                id:id
            })
        } else {
            res.render('step3');
        }
    })
})

app.listen(3000);
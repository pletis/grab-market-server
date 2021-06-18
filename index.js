const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination : function(req, file, cb){
            cb(null, 'uploads/')
        },
        filename: function(req,file,cb){
            cb(null, file.originalname);
        }
    })
});

// tenserflow helper 
const detectProduct = require('./helpers/detectProduct');
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

// 상품 등록 API
app.post("/products", (req,res) => {
    const body = req.body;
    const {name, description, price, seller, imageUrl} = body;
    if(!name || !description || !price || !seller || !imageUrl){
        res.status(400).send("모든 필드를 입력해주세요!")
    }
    detectProduct(imageUrl, (type) => {
        models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl,
        type
    }).then((result) => {
        console.log("상품 생성 결과 : ",result);
        res.send({
            result,
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    })
    })
    
});

// 이미지 저장 API
app.post('/image', upload.single('image'),(req,res) => {
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl : file.path
    })
})


// 구매 API
app.post('/purchase/:id', (req,res) => {
    const {id} = req.params;
    models.Product.update({
        soldout : 1
    },{
        where: {
            id,
        },
      }
    ).then((result) => {
        res.send({
            result : true
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send('에러 발생!');
    }) 
});


// 상품 추천 API
app.get('/products/:id/recommendation', (req,res) => {
    const { id } = req.params
    models.Product.findOne({
        where:{
            id
        }
    })
    .then((product) => {
        const type = product.type
        models.Product.findAll({
            where:{
                type,
                id : {
                    [models.Sequelize.Op.ne] : id,
                }
            },
        })
        .then((products) => {
            res.send({
                products
            });
        })
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("에러가 발생했습니다.")
    })
})

app.listen(port, () => {
    console.log('itsmine 쇼핑몰 서버가 돌아가고 있습니다: ',port);
    models.sequelize.sync()
    .then(() => {
        console.log('DB 연결 성공');
    })
    .catch((err)=> {
        console.err(err);
        console.log('DB 연결 에러ㅜ');
        process.exit();
    }) 
});
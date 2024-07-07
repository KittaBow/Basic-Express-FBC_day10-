const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static('public'))



app.get('/', (req, res) => {
  res.render('index')
})

app.get('/page2', (req, res) => {
  // search_query from client
  // console.log(req.query.search_query)
  // ลอง console ออกมาว่าเป็นยังไง
  // 2 บรรทัดด้านล่างคือส่งค่า query ไปหน้าบ้าน
  let q = req.query.search_query
  res.render('page2',{q})
})

// Mockup product data (Array)
let products = []
for (let i = 1; i <= 100; i++) {
  let product = { 
    id: i,
    name: `Product ${i}`,
    description: `This is product ${i}`,
    price: (Math.random() * 100).toFixed(2)
  }
  products.push(product)
}

app.get('/product',(req, res) => {
  // request query by limit & page
  let limit = parseInt(req.query.limit)
  let page = parseInt(req.query.page)
  console.log(limit)
  console.log(page)

  // กำหนดการแสดงผล limit & page
  let startIndex = (page - 1) * limit
  let endIndex = page * limit
  let paginatedProduct = products.slice(startIndex,endIndex)

  res.render("product",{paginatedProduct, limit, page})
  // limit & page เพิ่มไปเพื่อทำหน้า "ถัดไปฝ้อนกลับ คือ request ขอค่าพวกนี้ด้วย
})

app.get('/edit-product/:id', (req, res) => {
  // :id ระบุ product id ที่เราต้องการแก้ไข เรียกว่า parameter
  // ออบเจ็กต์ URL มีพร็อพเพอร์ตี้ searchParams ที่คืนค่าออบเจ็กต์ที่มีชนิดข้อมูลเป็น URLSearchParams ทำให้สามารถเรียกใช้เมธอด get ของ URLSearchParams เพื่อคืนค่าของ Query String ที่สนใจออกมาได้
  // .find คือการค้นหาใน array products, p คือ arrow fn วิ่งเข้าไปหา obj id ที่เราต้องการ ถ้าเจอก็รันก้อนนั้นออกมา
  
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    // ! ถ้าเป็นจริงจะเปลี่ยนเป็นเท็จ ถ้าเป็นเท็จจะเปลี่ยนเป็นจริง=ถ้าไม่เจอ product => respon 404
    res.status(404).send('Product not found');
  } else {
    res.render('edit-product', { product });
  }
})

app.post('/edit-product', (req, res) => {
  const { id, name, description, price } = req.body;
  const productId = parseInt(id);
  const index = products.findIndex(p => p.id === productId);
  // findIndex เพราะต้องการหาข้อมูลจาก array 
  if (index === -1) {
    res.status(404).send('Product not found');
  } else {
    products[index] = { id, name, description, price };
    res.redirect('/product');
  }
})

app.post('/add-product', (req, res) => {
  // try console.log(req.body) to check result runnning, the result will be shown in terminal
  // const { id, name, description, price } = req.body;
  // set ตัวแปรรอรับค่า new product
  // ต้องเข้าไปที่ .body ด้วย เพราะ obj อยู่ตรงนั้น 
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const newProduct = {
    id: products.length + 1, //+1 จาก product length ที่เราตั้งค่า 100 ชิ้นไว้ตอนแรก
    name,
    description,
    price
  };
  // products = [{}, {id:101,name:"product101"}]
  products.push(newProduct);
  res.redirect('/product'); // redirect คือการเปลี่ยนหน้า product
})

app.post('/delete-product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) {
    res.status(404).send('Product not found');
  } else {
    products.splice(index, 1);
    res.redirect('/product');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

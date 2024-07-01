const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static('public'))

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

app.get('/product',(req, res)=>{
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let obj = {
  search_query:"borntodev"  
}
obj.search_query
  

const db = require("../../config/db")
module.exports = {
  all(){
    return db.query(`
    select * from products order by updated_at desc`)
  },
  create(data){
    const query = `
      insert into products (
        category_id,
        user_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      ) values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id
    `
    //R$ 1,00
    data.price =  data.price.replace(/\D/g,"")
    //100 devo dividir por 100 depois...
    const values = [
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1
    ] 
    return db.query(query, values)
  },
  find(id){
    return db.query(`select * from products where id = $1`,[id])
  },
  update(data){
    const query = `
    update products set 
    category_id=($1),
    name=($2),
    description=($3),
    old_price=($4),
    price=($5),
    quantity=($6),
    status=($7)
    where id=($8)
    `
    const values = [
      data.category_id,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id
    ]
    return db.query(query, values)
  },
  files(id){
    return db.query(`
    select * from files where product_id = $1`,[id])
  },
  search(params){
    const { filter, category } = params

    let query = "",
    filterQuery = `where`

    if(category){
      filterQuery = `${filterQuery}
      products.category_id = ${category}
      and`
    }

    filterQuery = `
      ${filterQuery}
      products.name ilike '%${filter}%'
      or products.description ilike '%${filter}%'
    `
    query = `
    select products.*,
      categories.name as category_name
    from products
    left join categories on (categories.id = products.category_id)
    ${filterQuery}
    group by categories.name, products.id
    `
    return db.query(query)
  }
}
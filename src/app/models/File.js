const db = require("../../config/db")
const fs = require("fs")
module.exports = {
  create({filename, path, product_id}){
    const query = `
      insert into files (
        name,
        path,
        product_id
        ) values ($1, $2, $3)
      returning id
    `
    const values = [
      filename,
      path,
      product_id
    ] 
    return db.query(query, values)
  },
  async delete(id){
    try{
      const result = await db.query(`select * from files where id = $1`,[id])
      const file = result.rows[0]
      
      fs.unlinkSync(file.path)
      return db.query(`
    delete from files where id = $1`,[id])
    }catch(err){
      console.log(err)
    }
  }
}
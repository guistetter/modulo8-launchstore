const db = require("../../config/db");
const { hash } = require("bcryptjs");
const { updateLocale } = require("moment");
const Product = require('../models/Product')
const fs = require('fs')
module.exports = {
  async findOne(filters) {
    try {
      let query = `SELECT *
      FROM users`;

      Object.keys(filters).map((key) => {
        // WHERE | OR | AND
        query = `${query}
        ${key}
      `;
        Object.keys(filters[key]).map((field) => {
          // email | cpf_cnpj
          query = `${query} users.${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(query);

      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  },
  async create(data) {
    try {
      const query = `
      insert into users (
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      ) values ($1, $2, $3, $4, $5, $6)
      returning id
    `;

      //hash de senha
      const passwordHash = await hash(data.password, 8);

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.cpf_cnpj.replace(/\D/g, ""),
        data.cep.replace(/\D/g, ""),
        data.address,
      ];

      const results = await db.query(query, values);
      return results.rows[0].id;
    } catch (err) {
      return console.log(err);
    }
  },
  
  async update(id,fields){
    try {
      let query = "update users set"

    Object.keys(fields).map((key, index, array) => {
      if((index + 1)< array.length){
        query = `${query}
                ${key} = '${fields[key]}',
                `
      } else {
        query = `${query}
        ${key} = '${fields[key]}'
        where id = ${id}
        `
      }
    })
    await db.query(query)
    return 
    } catch (error) {
      console.log(error, 'update error')
    }
  },
  async delete(id){
    let results = await db.query("select * from products where user_id = $1",[id])
    const products = results.rows 

    const allFilesPromise = products.map(product =>
    Product.files(product.id))

    let promiseResults = await Promise.all(allFilesPromise)
    
    await db.query('delete from users where id = $1', [id])

    promiseResults.map(results => {
      results.rows.map(file => {
        try {
          fs.unlinkSync(file.path)
        } catch (error) {
          console.error(error)
        }
      })
    })
  }
};

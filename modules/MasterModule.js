const db = require("../core/db")

const db_Select = (select, table_name, whr, order) => {
    var tb_whr = whr ? `WHERE ${whr}` : "";
    var tb_order = order ? order : "";
    let sql = `SELECT ${select} FROM ${table_name} ${tb_whr} ${tb_order}`;
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result, sql };
            }
            resolve(data);
        });
    });
};

const db_Insert = (table_name, fields, values, whr, flag) => {
    var sql = "",
        msg = "",
        tb_whr = whr ? `WHERE ${whr}` : "";
    // 0 -> INSERT; 1 -> UPDATE
    // IN INSERT flieds ARE TABLE COLOUMN NAME ONLY || IN UPDATE fields ARE TABLE NAME = VALUES
    if (flag > 0) {
        sql = `UPDATE ${table_name} SET ${fields} ${tb_whr}`;
        msg = "Updated Successfully !!";
    } else {
        sql = `INSERT INTO ${table_name} ${fields} VALUES ${values}`;
        msg = "Inserted Successfully !!";
    }
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: msg, lastId };
            }
            resolve(data);
        });
    });
};

const db_Delete = (table_name, whr) => {
    whr = whr ? `WHERE ${whr}` : "";
    var sql = `DELETE FROM ${table_name} ${whr}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Deleted Successfully !!" };
            }
            resolve(data);
        });
    });
};

const months = [
    {id: "1" 
    , name: "January",},
    {id: "2" 
    , name: "February",},
    {id: "3" 
    , name: "March",},
    {id: "4" 
    , name: "April",},
    {id: "5" 
    , name: "May",},
    {id: "6" 
    , name: "June",},
    {id: "7" 
    , name: "July",},
    {id: "8" 
    , name: "August",},
    {id: "9" 
    , name: "September",},
    {id: "10" 
    , name: "October",},
    {id: "11" 
    , name: "November",},
    {id: "12" 
    , name: "December"},
]

const years = [
    {id: "2023" 
    , name: "2023",},
    {id: "2024" 
    , name: "2024",},
    {id: "2025" 
    , name: "2025",},
    {id: "2026" 
    , name: "2026",}
]

module.exports = {db_Select,db_Insert,db_Delete,months,years}
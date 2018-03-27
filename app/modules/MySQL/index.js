const mysql = require('mysql');
const { escape } = mysql;

const connections = {};

function MySQL() {}

MySQL.prototype.connectDB = (host, user, password, database) => {
    connections[database] = mysql.createConnection({ host, user, password, database });
};

MySQL.prototype.insertInto = (db, table, data) => {
    const pairs = Object.entries(data);

    let query = "INSERT INTO " + db + '.' + table + " ";
    let columns = '(';
    let values = ' VALUES (';

    pairs.forEach((pair, i) => {
        if (i === pairs.length - 1) {
            columns += pair[0] + ')';
            values += escape(pair[1]) + ')';
        } else {
            columns += pair[0] + ',';
            values += escape(pair[1]) + ',';
        }
    });

    query += columns + values;

    return new Promise((resolve, reject) => {
        connections[db].query(query, (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
};

MySQL.prototype.selectFrom = (db, table, columns, conditions) => {
    const isConditions = !!conditions && (!!conditions.and || !!conditions.or);
    
    switch (true) {
        case !db: return new Promise((resolve, reject) => reject('DB name hasn\'t been provided'));
        case !table: return new Promise((resolve, reject) => reject('Table name hasn\'t been provided'));
        case (!columns && !isConditions): return selectAllFrom(db, table);
        case (columns instanceof Array && !isConditions): return selectColsFrom(db, table, columns);
        case (columns instanceof Array && isConditions): return selectFromWhere(db, table, columns, conditions);
        case (!columns && isConditions): return selectAllFromWhere(db, table, conditions);
        default: return new Promise((resolve, reject) => reject('Incorrect arguments were provided'));
    }
};

function selectAllFrom(db, table) {
    return new Promise((resolve, reject) => {
        connections[db].query(`SELECT * FROM ${db + '.' + table}`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function selectColsFrom(db, table, columns) {
    return new Promise((resolve, reject) => {
        connections[db].query(`SELECT ${columns} FROM ${db + '.' + table}`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function selectFromWhere(db, table, columns, conditions) {
    return new Promise((resolve, reject) => {
        connections[db].query(`SELECT (${columns}) FROM ${db + '.' + table} ${getWhereQuery(conditions)}`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function selectAllFromWhere(db, table, conditions) {
    return new Promise((resolve, reject) => {
        connections[db].query(`SELECT * FROM ${db + '.' + table} ${getWhereQuery(conditions)}`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getWhereQuery(conditions) {
    const isAnd = !!conditions.and;
    const isOr = !!conditions.or;

    const andConditions = isAnd ? Object.entries(conditions.and).map(cond => cond[0] + "='" + cond[1] + "'").join(' AND ') : '';
    const orConditions = isOr ? Object.entries(conditions.or).map(cond => cond[0] + "='" + cond[1] + "'").join(' OR ') : '';
    const connector = (andConditions.length > 1 && orConditions.length === 0) ||
        (andConditions.length === 0 && orConditions.length > 1)? '' : ' OR ';

    return `WHERE ${andConditions + connector} ${orConditions}`;
}

module.exports = MySQL;

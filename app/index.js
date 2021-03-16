const express = require('express');
const mysql = require('mysql');
const util = require('util');
const random_name = require('node-random-name'); 

const app = express();

function makedb(config){
    const connection = mysql.createConnection( config );
    return {
        query( sql, args ) {
        return util.promisify( connection.query )
            .call( connection, sql, args );
        },
        close() {
        return util.promisify( connection.end ).call( connection );
        }
    };
}

const config = {
    host: "db",
    user: "root",
    password: "root",
    database: "desafiodb"
};

const connection = makedb(config);

app.get('/', async (request, response)=>{
    await connection.query(`INSERT INTO people (name) VALUES ('${random_name()}')`);

    const people = await connection.query('SELECT * FROM people');

    let html = '<h1>Full Cycle Rocks!</h1><ul>';
    
    for (const key in people) {
        html += `<li>${people[key].name}</li>`;
    }

    html += '</ul>'

    return response.send(html);
});

app.listen(3000, ()=>{
    console.log('Server connected!');
})
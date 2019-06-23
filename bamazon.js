var inquirer = require("inquirer");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("*****************************************")
    console.log("Connected as ID " + connection.threadId);
    console.log("*****************************************")
    showAllProducts();
});



function showAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        askFirstQuestion();
    });
}


function askFirstQuestion() {

    inquirer.prompt([
        {
            name: "ID",
            message: "What is the ID of the product you would like to buy?"
        },
        {
            name: "Quantity",
            message: "How many would you like to buy?"
        }
    ]).then(function (answers) {

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.log(res.length)
            // console.log(res.id)
            for (var i = 0; i < res.length; i++) {
                // console.log("first log " + res[i].id)
                if (answers.ID == res[i].id) {
                    console.log("We have found your product!");
                    var chosenIndex = answers.ID - 1
                    // console.log("Chosen Index: " + chosenIndex + " Chosen Quantity: " + answers.Quantity)
                    // console.log("Quantity Of Chosen Product: " + res[chosenIndex].stock_quantity)
                    if (answers.Quantity <= res[chosenIndex].stock_quantity) {
                        connection.query(

                            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                            [answers.Quantity, answers.ID],

                            function (err, res) {

                                console.log(res.affectedRows + " products updated!\n");

                            }
                        );
                    }
                    

                } else {

                    console.log("No product exists!")
                    
                }
            }

        });

    })

}

// function askSecondQuestion(itemId) {

//     var chosenId = itemId

//     inquirer.prompt([
//         {
//             name: "Quantity",
//             message: "How many would you like to buy?"
//         }
//     ]).then(function (answers, chosenId) {

//         connection.query("SELECT * FROM products", function (err, res) {
//             if (err) throw err;
//             console.log(res.length)

//             for (var i = 0; i < res.length; i++) {
//                 // console.log("Answer ID: " + answers.ID)
//                 // console.log("Results Length ID: " + res[i].id)
//                 if (answers.ID == res[i].id) {
//                     console.log("We have found your product!");
//                     return
//                 } else {
//                     console.log("No product exists!")
//                     return
//                 }
//             }

//         });

//         function updateProduct() {

//             console.log("Purchasing...\n");
//             connection.query(

//                 "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
//                 [answers.Quantity, answers.ID],

//                 function (err, res) {

//                     console.log(res.affectedRows + " products updated!\n");

//                 }
//             );

//         }

//         updateProduct();
//         readProducts();

//     }

//     );
// }



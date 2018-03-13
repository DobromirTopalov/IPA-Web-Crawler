'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Webstores", deps: []
 * createTable "Watches", deps: [Webstores]
 * createTable "Characteristics", deps: [Watches]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2018-03-13T11:53:47.788Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Webstores",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "web_page": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Watches",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.TEXT,
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "WebstoreId": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Webstores",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Characteristics",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "producer": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "price": {
                    "type": Sequelize.FLOAT,
                    "allowNull": false,
                    "validate": {
                        "isDecimal": true
                    }
                },
                "waranty": {
                    "type": Sequelize.INTEGER,
                    "allowNull": false,
                    "validate": {
                        "len": [1, 120]
                    }
                },
                "mechanics": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "proof_level": {
                    "type": Sequelize.STRING,
                    "allowNull": true
                },
                "clock_face": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "WatchesId": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Watches",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const common = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    synchronize: true,
    logging: false,
};
const dbType = (_a = process.env.DB_TYPE) !== null && _a !== void 0 ? _a : 'sqlite';
let options;
if (dbType === 'postgres') {
    options = {
        type: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT || 5432),
        username: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
        ...common,
    };
}
else {
    options = {
        type: 'sqlite',
        database: process.env.SQLITE_DB || 'toxic.db',
        ...common,
    };
}
exports.default = options;
//# sourceMappingURL=ormconfig.js.map
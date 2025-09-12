"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../src/config/ormconfig");
const user_entity_1 = require("../src/auth/entities/user.entity");
const bcrypt = require("bcrypt");
(async () => {
    const ds = new typeorm_1.DataSource(ormconfig_1.default);
    await ds.initialize();
    const repo = ds.getRepository(user_entity_1.User);
    const exists = await repo.findOne({ where: { email: 'admin@local' } });
    if (!exists) {
        const u = repo.create({ email: 'admin@local', passwordHash: await bcrypt.hash('admin', 10), role: 'ADMIN' });
        await repo.save(u);
        console.log('Admin creado: admin@local / admin');
    }
    else {
        console.log('Admin ya existe');
    }
    await ds.destroy();
})();
//# sourceMappingURL=seed.js.map
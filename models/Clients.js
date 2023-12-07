const db = require("../config/db");

class Clients {
    constructor({ client_age, client_name, client_email }) {
        this.client_age = client_age;
        this.client_name = client_name;
        this.client_email = client_email;
    };

    async saveToDb() {
        const INSERT = `
        INSERT INTO clients (client_age, client_name, client_email)
        VALUES (
            ${this.client_age},
            "${this.client_name}",
            "${this.client_email}"
        );`;
        const addClient = await db.execute(INSERT);
        return addClient;
    };

    static async findAll(filter, offset, limit) {
        const SELECT = `SELECT ${filter} FROM \`clients\` WHERE \`deleted_at\` IS NULL AND \`id\` BETWEEN ${offset} AND ${limit}`
        const [getClient, _] = await db.execute(SELECT);
        return getClient;
    };

    static async findById(id) {
        const SELECTbyID = "SELECT * FROM `clients` WHERE id = ? AND `deleted_at` IS NULL"
        const [getClientById, _] = await db.execute(SELECTbyID, [id]);
        return getClientById
    };

    static async softDelete(id) {
        const deleteSoft = `UPDATE \`clients\` SET \`deleted_at\` = CURRENT_TIMESTAMP WHERE id = ? AND \`deleted_at\` IS NULL`
        const [softDeleteClient, _] = await db.execute(deleteSoft, [id]);
        return softDeleteClient;
    };

    static async Delete(id) {
        const hardDelete = "DELETE FROM `clients` WHERE `id` = ?";
        await db.execute(hardDelete, [id]);
    };

    static async findBySearch(filter, by, searchQuery) {
        const searchBy = `SELECT ${filter} FROM \`clients\` WHERE \`deleted_at\` IS NULL AND ${by} LIKE '%${searchQuery}%';`
        const [searchResults, _] = await db.execute(searchBy);
        console.log(searchBy);
        return searchResults;
    };

    static async updateClient(id, { client_name, client_age, client_email }) {
        const update = `UPDATE \`clients\` SET \`client_name\`= "${client_name}",\`client_age\`=${client_age},\`client_email\`="${client_email}" WHERE \`id\` = ? AND \`deleted_at\` IS NULL`;
        const [updatedResults, _] = await db.execute(update, [id]);
        console.log(updatedResults);
        return updatedResults;
    }

    static async updateClientInfo(id, body) {

        const patch = Object.entries(body).map(entry => {
            const [key, value] = entry;
            const formattedValue =  typeof value === "string" ? `"${value}"` : `${value}`;
            return `${key} = ${formattedValue}`
        }).join(", ");

        const updateInfo = `UPDATE clients SET ${patch} WHERE id = ? AND deleted_at IS NULL`;
        const [updatedResults, _] = await db.execute(updateInfo, [id]);
        console.log(typeof updatedResults);
        return updatedResults;
    }
}

module.exports = Clients;
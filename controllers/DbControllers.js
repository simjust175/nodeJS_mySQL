const { date } = require("joi");
const ClientModels = require("../models/clients");
const bcrypt = require("bcrypt");

class ClientSystem {
    static statusCheck(data, necessaryKeys) {
        let msg = "";
        if (Object.keys(data).length === 0) {
            console.error("no data posted!");
            return msg = `Cannot POST empty data.`;
        };

        const keys = Object.keys(necessaryKeys);
        keys.forEach(key => {
            if (!data[key]) {
                console.error(`Cannot post missing: ${key}`);
                return msg = `Cannot POST when missing: ${key}`;
            }
        });
        return msg;
    };

    static async postClient(req, res) {
        const data = req.body;
        const addClient = new ClientModels(data);
        const stat = this.statusCheck(data, addClient);
        if (stat) return res.status(404).send(stat);
        await addClient.saveToDb();
        console.log(addClient);
        res.status(200).send({ "msg": "New client POSTed successfully.", addClient });
    };

    static async postClientHash(req, res) {
        const data = req.body;
        const isValid = await ClientModels.isValueValid(data);
        if (isValid.error) {
            return res.status(400).json(isValid.error.details);
        };
        console.log(data);
        try {
            data.client_email = await bcrypt.hash(data.client_email, 10);
            await ClientModels.saveToDbNew(data);
            return res.status(200).json({ msg: "Posted and hashed successfully!" })
        } catch (error) {
            console.error(error);
        }
    };

    static async getAll(req, res) {
        const filter = req.query.filter || "*";
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 30;
        const getClient = await ClientModels.findAll(filter, offset, limit);
        console.log({ Count: getClient.length, getClient });
        res.status(201).json({ Count: getClient.length, getClient });
    };

    static async getById(req, res) {
        const id = req.params.id;
        const [clientById, _] = await ClientModels.findById(id);
        console.log(`Client by id returned: ${clientById}`);
        res.status(201).json({ idFound: clientById });
    };

    static async deleteClient(req, res) {
        const id = req.params.id;
        await ClientModels.softDelete(id);
        console.log(`Deleted client number: ${id}`);
        res.status(200).json({ msg: `Soft deleted client number: ${id}` });
    };

    //hard delete(not recommended) WARNING! IF NO "WHERE" IS DEFINED
    static async hardDelete(req, res) {
        const id = req.params.id;
        await ClientModels.Delete(id);
        console.log(`!! HARD deleted client number: ${id} !!`);
        res.status(200).json({ msg: `!! Hard deleted client number: ${id}` });
    };

    //Search
    static async getSearched(req, res) {
        let searchQuery = req.query.q;
        let filter = req.query.filter || "*";
        let by = req.query.by || "client_name";
        const results = await ClientModels.findBySearch(filter, by, searchQuery);
        console.log(`Searched results returned`);
        res.status(201).send({ "msg": "Searched results returned", results });
    };

    //PUT
    static async putClient(req, res) {
        const id = req.params.id;
        const put = await ClientModels.updateClient(id, req.body);
        console.log(`Successfully PUT client: ${id}, info: ${put}`);
        res.status(201).json({ Msg: `Successfully PUT client: ${id}`, put });
    };

    //PATCH
    static async patchClient(req, res) {
        const id = req.params.id;
        const patchedClient = await ClientModels.updateClientInfo(id, req.body);
        console.log(patchedClient);
        res.status(201).json({ Msg: `Successfully PATCHED client: ${id}`, patchedClient });
    };

    // ~~~~~~~~~~~~~~~~~ \\ LOG -IN // ~~~~~~~~~~~~~~~~~~ \\

    static async login(req, res){
        const validation = await ClientModels.validateLogin(req.body);
        if(!validation) return res.status(401).json({msg: "Details missing"});
        const email = await ClientModels.findByName(req.body.name);
        const isEmail = email[0][0]?.client_email;
        const isValid = !isEmail ? false : await bcrypt.compare(req.body.email, email[0][0]?.client_email);
        if(!isValid) return res.status(401).json({msg: "Auth failed."});
        res.status(200).json({msg: "Auth successful"});
    };
};

module.exports = ClientSystem;
const express = require("express");
const route = express.Router();

const ClientController = require("../controllers/DbControllers");
//const Controller = new ClientController();

//POST
route.post("/post/", ClientController.postClient.bind(ClientController));

//GET all
route.get("/", ClientController.getAll.bind(ClientController));

//Get by id
route.get("/id/:id", ClientController.getById.bind(ClientController));

//Soft DELETE
route.delete("/delete/:id", ClientController.deleteClient.bind(ClientController));

//Hard DELETE (not recommended)
route.delete("/hardDelete/:id", ClientController.hardDelete.bind(ClientController));

//Search
route.get("/search/", ClientController.getSearched.bind(ClientController));

//PUT
route.put("/put/:id", ClientController.putClient.bind(ClientController));

//PATCH
route.patch("/patch/:id", ClientController.patchClient.bind(ClientController));

module.exports = route;
const express = require("express")
const router = express.Router()
const bankService = require("../services/bank/bank-account.service")
const auth = require('./auth')

// Partner routes
router.post("/create/p/:partnerId", auth.optional, bankService.create.bind(bankService)); // p - partber, u - user
router.post("/resolve-account/:partnerId", auth.optional, bankService.resolveAccount.bind(bankService));
router.get("/all", auth.optional, bankService.getAllBank.bind(bankService));

router.get("/partner/:partnerId", bankService.getByPartnerId.bind(bankService))
router.get("/accounts", bankService.getAll.bind(bankService))
router.get("/accounts/:bankId", bankService.getById.bind(bankService))
router.delete("/accounts/:bankId", bankService.delete.bind(bankService))

module.exports = router

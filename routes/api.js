const express = require("express")
const router = express.Router()
const userService = require("../services/user/user.service")
const authService = require("../services/auth/auth.service")
const pinService = require("../services/pin/pin.service")
const uploadService= require('../services/uploads/upload.service');
const auth = require('./auth');

const beneficiaryService= require('../services/beneficiary/beneficiary.service');
const transferService= require('../services/transaction/transfer.service');
const walletService= require('../services/transaction/wallet.service');
const cardService= require('../services/card/card.service');
const bankService= require('../services/bank/bank.service');

// Authentication
router.post('/login', auth.optional, authService.login.bind(authService))
router.get('/current', auth.required, authService.currentUser.bind(authService))

// User routes
router.post("/create", userService.create.bind(userService))
router.post("/verify", userService.verifyUser.bind(userService))
router.post("/forgot-password", userService.forgotPassword.bind(userService))
router.post("/forgot-password/verify", userService.verifyUserPasswordCode.bind(userService))
router.post("/reset-password", userService.resetUserPassword.bind(userService))
router.get("/all", auth.optional, userService.getAll.bind(userService))
router.get("/user/:userId", userService.getById.bind(userService))
router.put("/user/:userId", userService.update.bind(userService))
router.delete("/user/:userId", userService.delete.bind(userService))
router.get("/user/status/:phone", userService.getUserVerifyStatus.bind(userService))

router.get('/upload-files',uploadService.uploadForm);
router.post('/upload-files/:email/:category',uploadService.uploadFiles);

router.post("/create-beneficiary", pinService.verify.bind(pinService),  beneficiaryService.create.bind(beneficiaryService))
router.get("/list-beneficiary/:phone", beneficiaryService.getByUserPhone.bind(beneficiaryService))

router.post("/create-transfer", transferService.create.bind(transferService))
router.post("/list-transfer/:phone", transferService.getByUserPhone.bind(transferService))

router.post("/wallet", walletService.create.bind(walletService))
router.get("/balance/:phone", walletService.getByUserPhone.bind(walletService))

router.post("/add-card", cardService.create.bind(cardService))
router.get("/list-card/:phone", cardService.getByUserPhone.bind(cardService))

router.post("/add-bank", bankService.create.bind(bankService))
router.get("/list-bank/:phone", bankService.getByUserPhone.bind(bankService))

module.exports = router

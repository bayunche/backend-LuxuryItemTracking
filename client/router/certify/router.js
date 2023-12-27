const express=require("express")
const router=express.Router()
const certiy=require("./certify")

router.post("/mintLuxuryItem",certiy.mintLuxuryItem)
router.get("/getItem",certiy.getItemDetails)
router.get("/isExists",certiy.isExists)
router.get("/signupUser",certiy.createUserPrivateKey)
router.post("/updateLogistics",certiy.updateLogisticInfo)
router.get("/getLogisticsInfo",certiy.getLogisticsInfo)
router.get("/getItemList",certiy.getItemList)

module.exports = router;
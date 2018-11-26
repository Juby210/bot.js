const express = require('express');
const router = express.Router();
const config = require("../../config.json");

router.get('/', (req, res) => {
    let lang = req.query.lang ? req.query.lang : config.settings.lang;
    const SManager = require("../../strings/manager");
    const strings = new SManager(lang);
    res.send({msg: strings.getMsgDW(req.query.msg), lang: lang});
});

module.exports = router;
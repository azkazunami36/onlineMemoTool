//@ts-check

import fs from "fs";
import express from "express";

import variousLibrary from "./variousLibrary/sumLibrary.js";

if (!fs.existsSync("./data")) fs.mkdirSync("./data");
if (!fs.existsSync("./data/userData.json")) fs.writeFileSync("./data/userData.json", JSON.stringify({}));
if (!fs.existsSync("./data/userText")) fs.mkdirSync("./data/userText");

/** @type { userData } */
const userData = JSON.parse(String(fs.readFileSync("./data/userData.json")));

const exp = new variousLibrary.originalModules.easyExpress();

exp.get((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        const html = String(variousLibrary.externalModules.fs.readFileSync("index.html"));
        const script = String(variousLibrary.externalModules.fs.readFileSync("program.js"));
        const htmlSplit = (() => {
            const splited = html.split("<script></script>");
            if (!splited[0] || !splited[1]) return;
            return { start: splited[0], end: splited[1] };
        })();
        res.header("Content-Type", "text/html;charset=utf-8");
        if (htmlSplit !== undefined) {
            res.status(200);
            res.end(htmlSplit.start + "<script>" + script + "</script>" + htmlSplit.end);
        } else {
            res.status(500);
            res.end("Server Error");
        }
    }
});
/**
 * 
 * @param {string} userName 
 * @param {string} password 
 */
function certification(userName, password) {
    const userNames = (() => {
        const data = {}
        const userIds = Object.keys(userData.user)
        for (let i = 0; i !== userIds.length; i++) 
            data[userData.user[userIds[i]].userName] = userIds[i];
        return data
    })();
    if (userNames[userName] && userData.user[userNames[userName]] && userData.user[userNames[userName]].password === password) return true 
    else false
}

let postAccessIpList = {};
let resetTime = 0;

exp.easyPost((data, req, res) => {
    const nowTime = Date.now();
    if (nowTime - resetTime > 30000) {
        postAccessIpList = {};
        resetTime = nowTime;
    }
    if (!postAccessIpList[req.ip]) postAccessIpList[req.ip] = 1;
    else if (postAccessIpList[req.ip] > 30) {
        res.status(425);
        res.end("Too Early");
    }
    if (postAccessIpList[req.ip]) postAccessIpList[req.ip]++;
    /** @type {request} */
    const request = JSON.parse(data);
    console.log(request)
    if (request.type === "UserTest") {
        if (certification(request.data.userName, request.data.password)) {
            res.status(200);
            res.end("OK");
        } else {
            res.status(401);
            res.end("Unauthorized")
        }
        
    }
});

exp.app.listen("80", () => {
    console.log("準備OK");
});

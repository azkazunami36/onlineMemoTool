//@ts-check

const data = "";

/**
 * httpリクエストできる関数
 * @param {string} request URLに含ませるリクエスト(処理分岐)を入力
 * @param {string} send 送信したいテキスト(JSONもstringifyで可能)
 * @returns
 */
async function httpDataRequest(request, send) {
    return await new Promise(resolve => {
        const req = new XMLHttpRequest();
        req.open("POST", "http://" + location.hostname + ":" + location.port + (request !== "" ? ("/" + request) : ""));
        req.setRequestHeader("content-type", "text/plain;charset=UTF-8");
        req.send(send); //データを送信
        req.onreadystatechange = async () => { if (req.readyState === 4 && req.status === 200)
            resolve(req.responseText); }; //レスポンスを返す
    });
}

addEventListener("load", () => {
    const username = document.createElement("input");
    username.type = "text";
    const password = document.createElement("input");
    password.type = "password";
    const sendButton = document.createElement("input");
    sendButton.type = "button";
    sendButton.value = "ログイン";
    document.body.appendChild(username);
    document.body.appendChild(password);
    document.body.appendChild(sendButton);

    sendButton.addEventListener("click",async () => {
        const json = {
            type: "UserTest",
            data: {
                userName: username.value,
                password: password.value
            }
        }
        const stat = await httpDataRequest("", JSON.stringify(json));
        console.log(stat)
    })
});

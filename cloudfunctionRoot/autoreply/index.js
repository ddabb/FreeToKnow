// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event)
    let result = ''
    let methodName = 'collection_get'
    let database = 'idiom'
    let msgType = 'text'
    let input = event.Content.toLowerCase() + '';
    console.log("input" + input)
    console.log("typeof aa" + typeof input)
    if (input.startsWith("/成语") || input.startsWith("/cy")) {
        let inputValue = input.replace("/成语", "").replace("/cy", "").trim();
        console.log("inputValue" + inputValue)
        let page = 1;
        let num = 1;
        let condition = {
            t: {
                $regex: '.*' + inputValue,
                $options: 'i'
            }
        }
        await cloud.callFunction({
            name: methodName,
            data: {
                database,
                page,
                num,
                condition,
                inputValue
            },
        }).then(res => {
            if (!res.result.data.length) {
                result = '没有找到成语';
            } else {
                if (res.result.data.length > 1) {
                    res.result.data.forEach(element => {
                        result += element.t + " \n ";
                    });
                } else {
                    let obj = res.result.data[0];
                    result = "" + obj.t + "\n\n解释\n" + obj.j + "\n\n出处\n" + obj.c;
                }
            }
        })
            .catch(console.error)
    } else if (input.indexOf("关") > -1) {
        result = '关关是世界上最鼓舞人心的人';
    } else if (input.indexOf("小程序") > -1) {
        result = '打开<a data-miniprogram-appid="wx7f84c0cb91de3181" data-miniprogram-path="pages/index/index">FreeToKnow</a>小程序，了解更多有趣知识~';
    } else {
        msgType = 'image';
    }

    if (msgType == 'text') {
        return {
            ToUserName: event.FromUserName,
            FromUserName: event.ToUserName,
            CreateTime: Date.parse(new Date()) / 1000,
            MsgType: 'text',
            Content: result
        }
    } else if (msgType == 'image') {
        return {
            ToUserName: event.FromUserName,
            FromUserName: event.ToUserName,
            CreateTime: Date.parse(new Date()) / 1000,
            MsgType: 'image',
            Image: {
                MediaId: "AQiE1ze7KMOn2mHA2Lvj7HfyVi0s1GwHJAqgbDnpFzk"
                // 该地址需要从配置文件中去获取
            }
        }
    }

    // 参考地址 https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html#1
}
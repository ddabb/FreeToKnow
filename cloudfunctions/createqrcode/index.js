// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
    console.log(event)
    console.log(context)

    const {
        path,
        size
    } = event

    try {
        if (!size) {
            size = 430
        }
        const result = await cloud.openapi.wxacode.get({
            path: path,
            width: size
        })
        return result
    } catch (err) {
        return err
    }
}
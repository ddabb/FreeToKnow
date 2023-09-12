const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    const { database, record } = event
    console.log(event)

    try {
        return await db.collection(database).add({
            data: record
        })
    } catch (e) {
        console.error(e)
    }
}
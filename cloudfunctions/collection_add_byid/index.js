const cloud = require('wx-server-sdk')
cloud.init()

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
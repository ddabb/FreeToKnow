const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    const { database, record, id } = event
    console.log(event)

    try {
        return await db.collection(database).doc(id).add({
            data: record
        })
    } catch (e) {
        console.error(e)
    }
}
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    const { database, id, values } = event
    console.log(event)

    try {
        return await db.collection(database).doc(id)
            .update({
                data: values
            })
    } catch (e) {
        console.error(e)
    }
}
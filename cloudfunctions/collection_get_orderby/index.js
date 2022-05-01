const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
    const { database, page, num, field, order, condition } = event
    console.log(event)

    try {
        return await db.collection(database)
            .where(condition)
            .orderBy(field, order)
            .skip(num * (page - 1))
            .limit(num)
            .get()
    } catch (err) {
        console.log(err)
    }
}
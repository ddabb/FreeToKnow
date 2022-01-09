const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {

  const { database, condition, fromdb, localField, foreignField, asfield } = event
  console.log(event)


  try {
    return await db.collection(database)
      .aggregate()
      .match(condition)
      .lookup({
        from: fromdb,
        localField: localField,
        foreignField: foreignField,
        as: asfield,
      })
      .end()


  } catch (e) {
    console.error(e)
  }
}
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
    /**
     * database: 数据表名称
     * page: 第几页
     * num: 每页几条数据
     * condition： 查询条件，例如 { name: '李白' }
     */

    const { database, page, num, inputValue, classify } = event
    console.log(event)

    try {
        return await db.collection(database)
            .where(
                _.and({ classify: classify },
                    _.or({
                        subject: {
                            $regex: '.*' + inputValue,
                            $options: 'i'
                        }
                    },
                        {
                            content: {
                                $regex: '.*' + inputValue,
                                $options: 'i'
                            }
                        })
                ))
            .skip(num * (page - 1))
            .limit(num)
            .get()
    } catch (err) {
        console.log(err)
    }
}
exports = async function(payload, response) {
  const mongodb = context.services.get('prayer-atlas');
  const ccprayer = mongodb.db('ccprayer');
  const prayer = mongodb.collection('prayer');
  
  const args = payload.query.text.split(" ");
  
  switch (args[0]) {
    case "new":
      const result = await prayer.insertOne({
        user_id: payload.query.user_id, 
        when: Date.now(),
        input: args[1]
      });
      if (result) {
        return {
          text: `Prayer saved - ${args[1]}`
        };
      }
      return {
        text: `God doesn't respond to empty prayers! :point_left:`
      };
    case "list":
      const findresult = await prayer.find({}).toArray();
      const strres = findresult.map(x => `<${x.input}> by <@${user_id}>`).join("\n")
      return {
        text: `Prayer posted on ${new Date().toLocaleString()}\n${strres}`
      };
    case "remove":
      const delresult = await prayer.deleteOne({
        user_id: {
          $eq: payload.query.user_id
        },
        input: {
          $eq: args[1]
        }
      });
      return {
        text: `Prayer removed ${delresult.deletedCount}`
      };
    default:
      return {
        text: `I will shoot :gun:`
      };
  }
}
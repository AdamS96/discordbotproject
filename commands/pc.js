const mongo = require('.././mongo')
const itemSchema = require('.././schemas/item-schema')
module.exports = {
    
    callback: (message, ...args)=>{
        
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

        let str = args.toString().toLocaleLowerCase().replace(/,/g, ' ');
        let itemName = capitalizeFirstLetter(str);
        var itemID

        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
              try {
                console.log('Connected to mongodb!')
                console.log(`Item Name: ${itemName}`)
                const result = await itemSchema.find({
                  //  name: `${itemName}`,
                  name: {$regex : itemName.toString(), "$options": "i" }
                //    name : {$regex : `${itemName}`},
                })
                console.log('Result: ', result[0].name + ' ' + result[0].id)
                itemID = result[0].id
                console.log(`Item ID: ${itemID}`)

                var getItemID = function(){return itemID;}
                var newItemID = getItemID();
                message.reply(`Item ID: ${newItemID}`)
              } 
              catch(err) {
                console.error(err.message);
              }
              finally {
                mongoose.connection.close()
              }
            })
            
          }
          
          connectToMongoDB()

         
    },
}


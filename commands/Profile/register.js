
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const mongoose = require('mongoose')
const { get } = require('axios')
const profile = require('../../schemes/profiledata')
module.exports = {
    name: "register",
    category: "Profile",
    aliases: ["login"],
    cooldown: 2,
    usage: "",
    description: "",
    run: async (client, message, args, user, text, prefix) => {
        const userprofile = await profile.findOne({id : message.author.id})
        if(userprofile === null){
            if(!args.length){
                const embed = new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle(`Parameter name missing`)
                .setThumbnail("https://img.icons8.com/color/452/error--v1.png")
                .setDescription(`${message.author.username}, please provide your fortnite account name using the format\n**s!register [ACCOUNT NAME]**`)
                return message.channel.send(embed)
            } else {
                const accountid = await get("https://fortniteapi.io/v1/lookup", {
                    params : {
                        username : args.join(" ")
                    },
                    headers : {
                        Authorization : config["fnapi.io"]
                    }
                })
                .catch(e => {
                    const embed = new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("An error occured")
                    .setThumbnail("https://img.icons8.com/color/452/error--v1.png")
                    .setDescription("An error occured with the request. If you believe this is a problem please contact me <@634099784428552213> or try again later.")
                    return message.channel.send(embed)
                })
                
                if(accountid.data.result === true){
                    const newprofile = new profile({
                        id : message.author.id,
                        account : accountid.data.account_id
                    })

                    const name = await get("https://fortniteapi.io/v1/stats", {
                        params : {
                            account : accountid.data.account_id
                        },
                        headers : {
                            Authorization : config["fnapi.io"]
                        }
                    })
                    const cos = await get("https://fortniteapi.io/v2/items/list?lang=fr", {
                        params : {
                            type : "outfit"
                        },
                        headers : {
                            Authorization : config["fnapi.io"]
                        }
                    })
                    
                    const random = cos.data.items[Math.floor(Math.random() * cos.data.items.length)]
                    
                    const embed = new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("You are well registered!")
                    .setDescription(`You have been registered with the ${name.data.name} account`)
                    .setThumbnail(random.images.icon)
                    message.channel.send(embed)
                    newprofile.save()
                    
                } else {
                    const embed = new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("An error occured")
                    .setThumbnail("https://img.icons8.com/color/452/error--v1.png")
                    .setDescription(accountid.data.error)
                    return message.channel.send(embed)

                }
            }
        } else {
            const cos = await get("https://fortniteapi.io/v2/items/list?lang=fr", {
                params : {
                    type : "outfit"
                },
                headers : {
                    Authorization : config["fnapi.io"]
                }
            })
            const name = await get("https://fortniteapi.io/v1/stats", {
                params : {
                    account : userprofile.account
                },
                headers : {
                    Authorization : config["fnapi.io"]
                }
            })
            
            const random = cos.data.items[Math.floor(Math.random() * cos.data.items.length)]
            const embed = new Discord.MessageEmbed()
            .setThumbnail(random.images.icon)
            .setTitle("You are already registered!")
            .setColor(ee.color)
            .setDescription(`You are already registered in our database as ${name.data.name}. To change account first do the !logout command.`)
            return message.channel.send(embed)
        }
        
    }
}
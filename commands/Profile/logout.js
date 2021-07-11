
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const profile = require('../../schemes/profiledata')
module.exports = {
    name: "logout",
    category: "Profile",
    aliases: [""],
    cooldown: 2,
    usage: "",
    description: "",
    run: async (client, message, args, user, text, prefix) => {
        const userprofile = await profile.findOne({id : message.author.id})

        if(userprofile != null){
            const embed = new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle('Do you want to logout?')
            .setDescription(`You are about to logout and all your data will be deleted from our database. Are you sure you want to continue?`)
            const msg = await message.channel.send(embed)
            msg.react('👍')
            msg.react('👎')
            // Create a reaction collector
            const filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && user.id === message.author.id
            let reaction = (await msg.awaitReactions(filter, {max : 1})).first();
            switch(reaction.emoji.name) {
                case "👍" : 
                    userprofile.delete()
                    const embt = new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle('You were successfully unregistered')
                    msg.edit(embt)
                    break;
                case "👎" :
                    const emb = new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("Logout cancelled")
                    msg.edit(emb)
                    break;
            }
        }
    }
}
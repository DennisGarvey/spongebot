const Discord = require('discord.js')
const secrets = require('./secrets.json')
const config = require('./config.json')
const ffmpeg = require('ffmpeg')
const delay = require('delay')
const client = new Discord.Client()

client.on('voiceStateUpdate', async function(oldState, newState){
    if(newState.member.id != config.targetUsers[newState.guild.id]) {return}
    if(newState.channel == null) { currentVC = oldState.guild.me.voice.channel; if(currentVC != null){currentVC.leave()} return}
    if(newState.channel.equals(oldState.channel)) {return}

    //kill switch detection
    roles = newState.guild.me.roles.cache
    for(i = 0; i<roles.size; i++){
        roles.sweep(function(role){
            return role.name != "kill switch"
        })

    }
    if(roles.size == 1) {
        if(newState.guild.me.voice.channel!=null){
            newState.guild.me.voice.channel.leave()
        }
        return
    }
    //

    if(newState.guild.me.voice.channel!=null){
        newState.guild.me.voice.channel.leave()
        await delay(100)
    }

    if(newState.channel!=null){
        let connection = await newState.channel.join()
        let dispatcher = connection.play('./krabs/hello.mp3')
        console.log("hello")
        
    }
    //if(newState.channel)
})

//auto unserver mute bot
client.on('voiceStateUpdate', function(oldState, newState){
    if(client.user.id!=newState.member.id) {return}
    if(newState.mute){
        newState.guild.me.voice.setMute(false)
    }
    if(newState.serverDeaf){
        newState.guild.me.voice.setDeaf(false)
    }
})

//walking sounds
client.on('guildMemberSpeaking', async function(member, speaking){
    if(member.id!=config.targetUsers[member.guild.id]) {return}

    if(speaking==true){
        console.log("speaking")
        member.guild.me.voice.connection.play('./krabs/walking.mp3', {volume: 0.25})
    }
    else{
        console.log("notspeaking")
        member.guild.me.voice.connection.play('')
    }
})


client.on('rateLimit', function(data){
    console.log("--------------")
    console.log("Rate Limit")
    console.log(data)
    console.log("--------------")
})

client.on('ready', async function(){
    console.log("Bot Online")
    await client.user.setStatus('online')
})

client.login(secrets.token)

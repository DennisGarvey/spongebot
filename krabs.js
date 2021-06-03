const Discord = require('discord.js')
const secrets = require('./secrets.json')
const config = require('./config.json')
const ffmpeg = require('ffmpeg')
const delay = require('delay')
const client = new Discord.Client()

client.on('voiceStateUpdate', async function(oldState, newState){
    if(newState.member.id != config.targetUser) {return}
    if(oldState.channel == null) {return}
    if(oldState.channel.equals(newState.channel)) {return}

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

client.on('voiceStateUpdate', function(oldState, newState){
    if(client.user.id!=newState.member.id) {return}
    if(newState.mute){
        newState.guild.me.voice.setMute(false)
    }
})

client.on('guildMemberSpeaking', async function(member, speaking){
    if(member.id!=config.targetUser) {return}

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
    console.log(`Targeting: ${config.targetUser}`)
    
})

client.login(secrets.token)

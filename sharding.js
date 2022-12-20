// const Discord = require('discord.js');
// const Manager = new Discord.ShardingManager('./index.js');
const { ShardingManager } = require('discord.js')
// const manager = new ShardingManager('./index.js', { token: process.env['DISCORD_TOKEN']})
const manager = new ShardingManager('./index.js', {
    token: process.env['DISCORD_TOKEN'],
    respawn: true,
})

// Manager.spawn(3);
// Manager.on('launch', shard => console.log(`- Spawned shard ${shard.id} -`)); // Optional

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
    shard.on('ready', () => {
        console.log('Shard ready')
    })
    shard.on('disconnect', (a, b) => {
        console.log('Shard disconnected')
        console.log(a)
        console.log(b)
    })
    shard.on('reconnecting', (a, b) => {
        console.log('Shard reconnecting')
        console.log(a)
        console.log(b)
    })
    shard.on('death', (a, b) => {
        console.log('Shard died')
        console.log(a)
        console.log(b)
    })
})
manager.spawn()
var roleHarvester = require('role/harvester');
var roleUpgrader = require('role/upgrader');
var roleBuilder = require('role/builder');

module.exports.loop = function () {
    // 清除死亡的creep缓存
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var energyAvailabe = Game.rooms['E51S43'].energyAvailable;

    // 保证有两个upgrader存活
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(upgraders.length < 2 && energyAvailabe >= 300 && Game.spawns['Spawn1'].spawning == null) {
        var newName = 'Upgrader-' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        if(energyAvailabe >= 500){
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'upgrader', upgrading: true}});
        }else{
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader', upgrading: true}});
        }
    }

    // 保证有两个builder存活
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 2 && energyAvailabe >= 300 && Game.spawns['Spawn1'].spawning == null) {
        var newName = 'Builder-' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        if(energyAvailabe >= 500){
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'builder', building: true}});
        }else{
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder', building: true}});
        }
    }

    // 保证有两个harvester存活
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 2 && energyAvailabe >= 300 && Game.spawns['Spawn1'].spawning == null) {
        var newName = 'Harvester-' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        if(energyAvailabe >= 500){
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'harvester', harvesting: true}});
        }else{
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester', harvesting: true}});
        }
    }

    // spawn产卵时显示该creep的角色
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // 指定某个防御塔的行为
    var tower = Game.getObjectById('9430acc9f14331ead4edaf78');
    if(tower) {
        // 修理破损的墙壁
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        // 攻击敌人
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // 运行所有creep,根据不同角色执行对应逻辑
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
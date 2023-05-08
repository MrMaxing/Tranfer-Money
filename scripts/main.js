import * as mc from '@minecraft/server';
import * as fm from '@minecraft/server-ui';
import { getScore, doMove } from './server/library.api';
// Objective to transfer money
const objective = 'money';
const prefix = '!'
const key = 'pay'
mc.system.events.beforeWatchdogTerminate.subscribe(event => event.cancel = true)
mc.world.events.beforeChat.subscribe((events) => {
    const player = events.sender;
    const message = events.message;
    if (!message.startsWith(`${prefix}${key}`))
        return;
    events.cancel = true;
    doMove(player, () => transfer(player));
});
function transfer(player) {
    const all_player = mc.world.getAllPlayers().filter((target) => target.id !== player.id);
    if (all_player.length === 0)
        return player.sendMessage('§c>>§r There is no player online');
    const money = getScore(objective, player);
    const from = new fm.ModalFormData();
    from.title('Transfer Money');
    from.dropdown(`§6»§r Select Player`, all_player.map((player) => player.name));
    from.slider(`§d»§r Select Money`, 1, money, 1);
    from.show(player).then(({ formValues, canceled }) => {
        if (canceled)
            return;
        const target = all_player[formValues[0]];
        const moneyResult = formValues[1];
        if (moneyResult > money)
            return player.sendMessage('§c>>§r You don\'t have enough money');
        if (moneyResult < 1)
            return player.sendMessage('§c>>§r You can\'t send negative money');
        player.runCommandAsync(`scoreboard players remove @s money ${moneyResult}`);
        target.runCommandAsync(`scoreboard players add @s money ${moneyResult}`);
        player.sendMessage(`§a>>§r You have sent ${moneyResult} to ${target.name}`);
        target.sendMessage(`§a>>§r You have received ${moneyResult} from ${player.name}`);
    })
}

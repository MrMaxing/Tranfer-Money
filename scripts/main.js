import * as mc from '@minecraft/server';
import * as fm from '@minecraft/server-ui';
import { getScore, doMove } from './server/library.api';
// Objective to transfer money
const objective = 'money';
const prefix = '!'
const key = 'pay'
mc.world.events.beforeChat.subscribe((events) => {
    const player = events.sender;
    const message = events.message;
    if (!message.startsWith(`${prefix}${key}`))
        return;
    events.cancel = true;
    doMove(player, () => tranfer(player));
});
function tranfer(player: mc.Player) {
    const all_player = mc.world.getAllPlayers();
    const money = getScore('money', player);
    const from = new fm.ModalFormData();
    from.title('Tranfer Money');
    from.dropdown(`§c»§r Select Player`, all_player.map((player) => player.name));
    from.slider(`§e»§r Select Money`, 1, money, 1);
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

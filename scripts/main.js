import * as mc from '@minecraft/server';
import * as fm from '@minecraft/server-ui';
import { getScore, doMove } from './server/library.api';
mc.world.events.beforeChat.subscribe((events) => {
    const player = events.sender;
    const message = events.message;
    if (!message.startsWith('!tranfer'))
        return;
    events.cancel = true;
    doMove(player, () => tranfer(player));
});
function tranfer(player) {
    const all_player = mc.world.getAllPlayers();
    const money = getScore('money', player);
    const from = new fm.ModalFormData();
    from.title('Tranfer Money');
    from.textField('Enter Player Name', 'example: Steve');
    from.textField('Enter Money', 'example: 100');
    from.show(player).then(({ formValues, canceled }) => {
        if (canceled)
            return;
        const target = all_player.find((player) => player.name === formValues[0]);
        const moneyResult = parseInt(formValues[1]);
        if (!target)
            return player.sendMessage('§c>>§r Player not found');
        if (moneyResult > money)
            return player.sendMessage('§c>>§r You don\'t have enough money');
        if (moneyResult < 0)
            return player.sendMessage('§c>>§r You can\'t send negative money');
        target.runCommandAsync(`scoreboard players add @s money ${moneyResult}`);
        player.sendMessage(`§a>>§r You have sent ${moneyResult} to ${target.name}`);
        player.runCommandAsync(`scoreboard players remove @s money ${moneyResult}`);
        target.sendMessage(`§a>>§r You have received ${moneyResult} from ${player.name}`);
    });
}

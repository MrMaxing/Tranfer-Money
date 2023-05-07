import * as mc from '@minecraft/server';
/**
 * Retrieves the score of the specified player for the given scoreboard objective.
 * If the objective does not exist, it will be created.
 * @param {string} objective - The name of the scoreboard objective.
 * @param {mc.Player} player - The player whose score is being retrieved.
 * @returns {number} The player's score for the aspecified objective.
 */
export function getScore(objective, player) {
    try {
        player.runCommandAsync(`scoreboard players add @s ${objective} 0`);
        return mc.world.scoreboard.getObjective(objective).getScore(player.scoreboard);
    }
    catch {
        player.runCommandAsync(`scoreboard objectives add ${objective} dummy`);
        console.warn(`The object named ${objective} was not found.`);
    }
}
/**
 * @param {mc.Player} target
 * @param {CallableFunction} callback
 * @returns {void}
 */
export function doMove(target, callback) {
    const ui = mc.system.runInterval(() => {
        const v = target.getVelocity();
        const speed = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
        if (speed > 0) {
            callback();
            mc.system.clearRun(ui);
        }
    }, 10);
}

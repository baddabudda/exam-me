const executor = require('./executor.js');

module.exports.acceptInvite = ({ group_host_id, group_guest_id, list_id, access_level }) => {
    return executor.execute({
        query:
            "INSERT INTO invite (group_host_id, group_guest_id, list_id, access_level) VALUES (?, ?, ?, ?)",
        params: [group_host_id, group_guest_id, list_id, access_level],
        single: true
    });
}

module.exports.changeAccessLevel = ({ group_host_id, group_guest_id, list_id, access_level }) => {
    return executor.execute({
        query:
            "UPDATE invite SET acces_level = ? WHERE group_host_id = ? AND group_guest_id = ? AND list_id = ?",
        params: [access_level, group_host_id, group_guest_id, list_id],
        single: true
    });
}

module.exports.checkInvite = ({ group_host_id, group_guest_id, list_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM invite WHERE group_host_id = ? AND group_guest_id = ? AND list_id = ?",
        params: [group_host_id, group_guest_id, list_id],
        single: true
    });
}
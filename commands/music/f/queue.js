let queue = {};

module.exports.getqueue = queue;
module.exports.getsongs = async (gid, callback) => callback(queue[gid].songs);
module.exports.addsong = async (gid, url, title, requester, duration, id) => queue[gid].songs.push({url: url, title: title, requester: requester, duration: duration, id: id});
module.exports.setvolume = async (gid, vol) => queue[gid].volume = parseInt(vol, 10);
module.exports.update = async newq => queue = newq;
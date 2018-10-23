let queue = {};

module.exports.getqueue = queue;
module.exports.getsongs = async (gid, callback) => callback(queue[gid].songs);
module.exports.addsong = async (gid, track, url, title, length, channel, requester) => queue[gid].songs.push({track: track, url: url, title: title, length: length, channel: channel, requester: requester});
module.exports.song = async (gid, title, channel, length, requester, url, track, dat) => queue[gid].song = {title: title, channel: channel, length: length, requester: requester, url: url, track: track, date: dat};
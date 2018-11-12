let queue = {};
let paused = {};

module.exports.getqueue = queue;
module.exports.getsongs = (gid, callback) => callback(queue[gid].songs);
module.exports.addsong = (gid, track, url, title, length, channel, requester) => queue[gid].songs.push({track: track, url: url, title: title, length: length, channel: channel, requester: requester});
module.exports.song = (gid, title, channel, length, requester, url, track, dat) => queue[gid].song = {title: title, channel: channel, length: length, requester: requester, url: url, track: track, date: dat};
module.exports.paused = gid => {
    if(!paused.hasOwnProperty(gid)) return false;
    return paused[gid].p;
}
module.exports.pause = (gid, p = true) => {
    if(p) {
        paused[gid] = {p, d: Date.now()};
    } else {
        if(!paused.hasOwnProperty(gid)) return;
        paused[gid].p = p;
        queue[gid].song.date = paused[gid].d + (queue[gid].song.date - paused[gid].d);
    }
}
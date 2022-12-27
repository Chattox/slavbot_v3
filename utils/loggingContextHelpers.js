const { isAdmin } = require('./isAdmin');

const sysLogCtx = (ctx) => {
  return {
    category: 'system',
    context: ctx,
  };
};

const cmdLogCtx = (
  prfx = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' },
  args = 'n/a'
) => {
  const cmdTypes = { '!': 'sound', '?': 'utility' };
  return {
    category: 'command',
    type: cmdTypes[prfx],
    user: usr.username,
    admin: isAdmin(usr.id, false),
    command: cmd,
    channel: chnl.name,
    args: args,
  };
};

const sndLogCtx = (snd = 'n/a', chnl = { name: 'n/a' }, isRand = false) => {
  return {
    category: 'sound',
    sound: snd,
    channel: chnl.name,
    isRand: isRand,
  };
};

const infoLogCtx = (
  cat = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' },
  args = 'n/a'
) => {
  return {
    category: cat,
    user: usr.username,
    admin: isAdmin(usr.id, false),
    command: cmd,
    channel: chnl.name,
    args: args,
  };
};

const warnLogCtx = (
  cat = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' },
  args = 'n/a'
) => {
  return {
    category: cat,
    user: usr.username,
    admin: isAdmin(usr.id, false),
    command: cmd,
    channel: chnl.name,
    args: args,
  };
};

const errLogCtx = (
  cat = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' },
  args = 'n/a'
) => {
  return {
    category: cat,
    user: usr.username,
    admin: isAdmin(usr.id, false),
    command: cmd,
    channel: chnl.name,
    args: args,
  };
};

module.exports = {
  sysLogCtx,
  cmdLogCtx,
  sndLogCtx,
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
};

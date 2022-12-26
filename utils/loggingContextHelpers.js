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

const infoLogCtx = (
  cat = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' }
) => {
  return {
    category: cat,
    user: usr.username,
    command: cmd,
    channel: chnl.name,
  };
};

const warnLogCtx = (
  cat = 'n/a',
  usr = { username: 'n/a' },
  cmd = 'n/a',
  chnl = { name: 'n/a' }
) => {
  return {
    category: cat,
    user: usr.username,
    command: cmd,
    channel: chnl.name,
  };
};

module.exports = { sysLogCtx, cmdLogCtx, infoLogCtx, warnLogCtx };

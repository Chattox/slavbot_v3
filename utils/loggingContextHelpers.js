const { isAdmin } = require('./isAdmin');

const sysLogCtx = (ctx) => {
  return {
    category: 'system',
    context: ctx,
  };
};

const cmdLogCtx = (prfx, usr, cmd, chnl, args) => {
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

const warnLogCtx = (
  cat,
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

module.exports = { sysLogCtx, cmdLogCtx, warnLogCtx };

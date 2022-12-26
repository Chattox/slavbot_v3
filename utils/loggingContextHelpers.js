const { isAdmin } = require('./isAdmin');

const sysLogCtx = (ctx) => {
  return {
    category: 'system',
    context: ctx,
  };
};

const cmdLogCtx = (prfx, usr, cmd, args) => {
  const cmdTypes = { '!': 'sound', '?': 'utility' };
  return {
    category: 'command',
    type: cmdTypes[prfx],
    user: usr.username,
    admin: isAdmin(usr.id, false),
    command: cmd,
    args: args,
  };
};

const warnLogCtx = (cat, usr = 'n/a', chnl = 'n/a') => {
  return {
    category: cat,
    user: usr.username,
    channel: chnl,
  };
};

module.exports = { sysLogCtx, cmdLogCtx, warnLogCtx };

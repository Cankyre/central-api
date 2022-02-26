getStats_fns = {
  tr: (u) => u.league.rating,
  apm: (u) => u.league.apm,
  pps: (u) => u.league.pps,
  vs: (u) => u.league.vs,
  wr: (u) => (u.league.gameswon * 100) / u.league.gamesplayed,
  app: (u) => u.league.apm / (u.league.pps * 60),
  dsps: (u) => u.league.vs / 100 - u.league.apm / 60,
  dspp: (u) => getStats_fns["dsps"](u) / u.league.pps,
  ci: (u) =>
    (getStats_fns["dspp"](u) * 100 + u.league.vs / 60) / u.league.pps +
    getStats_fns["app"](u),
  ge: (u) =>
    ((getStats_fns["app"](u) * getStats_fns["dsps"](u)) / u.league.pps) * 2,
};

ranks_percentiles = {
  x: 1,
  u: 5,
  ss: 11,
  "s+": 17,
  s: 23,
  "s-": 30,
  "a+": 38,
  a: 46,
  "a-": 54,
  "b+": 62,
  b: 70,
  "b-": 78,
  "c+": 84,
  c: 90,
  "c-": 95,
  "d+": 97.5,
  d: 100,
};

module.exports.stats = (lb) => {
  country_lbs = {
    tr: {},
    apm: {},
    pps: {},
    vs: {},
    wr: {},
    app: {},
    dsps: {},
    dspp: {},
    ci: {},
    ge: {},
  };

  ranks_playernum = {};
  lb.data.users.forEach((u) => {
    ranks_playernum[u.league.rank] = (ranks_playernum[u.league.rank] || 0) + 1
  })

  for (stat in country_lbs) {
    lb.data.users.forEach((u) => {
      if (!u.country) return;
      if (!country_lbs[stat][u.country]) country_lbs[stat][u.country] = [];
      country_lbs[stat][u.country] = [
        (country_lbs[stat][u.country][0] || 0) + getStats_fns[stat](u) ** 2,
        (country_lbs[stat][u.country][1] || 0) + 1,
      ];
    });
    for (i in country_lbs[stat]) {
      if (country_lbs[stat][i][1] < 30) {
        delete country_lbs[stat][i];
      } else {
        country_lbs[stat][i] = Math.sqrt(
          country_lbs[stat][i][0] / country_lbs[stat][i][1]
        );
      }
    }
    country_lbs[stat] = Object.fromEntries(
      Object.entries(country_lbs[stat]).sort((a, b) => b[1] - a[1])
    );
  }

  ranks_boundaries = {};

  for (i in ranks_percentiles) {
    ranks_boundaries[i] =
      lb.data.users[
        Math.floor((ranks_percentiles[i] / 100) * lb.data.users.length) - 1
      ].league.rating;
  }

  return {
    country_lbs,
    ranks_boundaries,
    ranks_percentiles,
    ranks_playernum
  }
}

module.exports.user = (u) => {
  a = {}
  for (stat in getStats_fns) {
    a[stat] = getStats_fns[stat](u)
  }
  a.badges = u.badges.map(i => i.id)
  a.avatar = `https://tetr.io/user-content/avatars/${u._id}.jpg?rv=${u.avatar_revision}`
  return a
}
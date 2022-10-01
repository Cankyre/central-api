old = {}

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
  app_dspp: (u) => getStats_fns["dspp"](u) + getStats_fns["app"](u),
  vs_apm: (u) => getStats_fns["vs"](u) / getStats_fns["apm"](u),
  nyaapp: (u) =>
    getStats_fns["app"](u) - 5 * Math.tan(getStats_fns["ci"] / -30 + 1),
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
    app_dspp: {},
    vs_apm: {},
    nyaapp: {},
  };

  ranks_avg = {
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
    app_dspp: {},
    vs_apm: {},
    nyaapp: {},
  }

  ranked_num = lb.data.users.length

  ranks_playernum = {};
  lb.data.users.forEach((u) => {
    ranks_playernum[u.league.rank] = (ranks_playernum[u.league.rank] || 0) + 1;
  });

  for (stat in country_lbs) {
    lb.data.users.forEach((u) => {
      if (!ranks_avg[stat][u.league.rank]) ranks_avg[stat][u.league.rank] = []
      ranks_avg[stat][u.league.rank] = [(ranks_avg[stat][u.league.rank][0] || 0) + getStats_fns[stat](u), (ranks_avg[stat][u.league.rank][1] || 0) + 1] 
      if (!u.country) return;
      if (!country_lbs[stat][u.country]) country_lbs[stat][u.country] = [];
      country_lbs[stat][u.country] = [
        (country_lbs[stat][u.country][0] || 0) + getStats_fns[stat](u) ** 2,
        (country_lbs[stat][u.country][1] || 0) + 1,
      ];
    });
    for (i in ranks_avg[stat]) {
      ranks_avg[stat][i] = ranks_avg[stat][i][0] / ranks_avg[stat][i][1]
    }
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
  ranks_variations = {}

  for (i in ranks_percentiles) {
    ranks_boundaries[i] =
      lb.data.users[
        Math.floor((ranks_percentiles[i] / 100) * lb.data.users.length) - 1
      ].league.rating;
  }

  for (let i in ranks_boundaries) {
    try {
      ranks_variations[i] = ranks_boundaries[i] - old.ranks_boundaries[i] || old.ranks_boundaries[i]
    } catch {
      ranks_variations[i] = 0
    }
  }

  old = {
    country_lbs,
    ranks_avg,
    ranks_boundaries,
    ranks_percentiles,
    ranked_num,
    ranks_playernum,
    ranks_variations
  }

  return old
};

module.exports.user = (u, r) => {
  a = {
    type: 1,
    badges: u.badges.map((i) => i.id),
    avatar: `https://tetr.io/user-content/avatars/${u._id}.jpg?rv=${u.avatar_revision}`,
    rank: u.league.rank,
    country: u.country,
  };
  for (stat in getStats_fns) {
    a[stat] = getStats_fns[stat](u);
  }
  for (record in r.records) {
    a[record] = r.records[record].record;
  }
  return a;
};

module.exports.two_users = (u1, u2) => {
  var a = {
    type: 2,
    u1: {
      badges: u1.badges.map((i) => i.id),
      avatar: `https://tetr.io/user-content/avatars/${u1._id}.jpg?rv=${u1.avatar_revision}`,
      rank: u1.league.rank,
      country: u1.country,
    },
    u2: {
      badges: u2.badges.map((i) => i.id),
      avatar: `https://tetr.io/user-content/avatars/${u2._id}.jpg?rv=${u2.avatar_revision}`,
      rank: u2.league.rank,
      country: u2.country,
    },
  };
  for (stat in getStats_fns) {
    a.u1[stat] = getStats_fns[stat](u1);
    a.u2[stat] = getStats_fns[stat](u2);
  }
  a["wc"] = Number(
    (
      (1 /
        (1 +
          Math.pow(
            10,
            (u2.league.glicko - u1.league.glicko) /
              (400 *
                Math.sqrt(
                  1 +
                    (3 *
                      Math.pow(Math.LN10 / 400, 2) *
                      (Math.pow(u1.league.rd, 2) + Math.pow(u2.league.rd, 2))) /
                      Math.pow(Math.PI, 2)
                ))
          ))) *
      (99 + 1)
    ).toFixed(3)
  );
  return a;
};

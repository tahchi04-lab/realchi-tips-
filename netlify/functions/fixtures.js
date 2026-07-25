exports.handler = async (event) => {
  const league = event.queryStringParameters?.league || '39';
  const season = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&league=${league}&season=${season}`,
      {
        headers: {
          'x-apisports-key': '1be311225f9e55103c91836f76e395ae'
        }
      }
    );
    const data = await res.json();
    const fixtures = (data.response || []).map(f => ({
      home: f.teams.home.name,
      away: f.teams.away.name,
      time: new Date(f.fixture.date).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
      league: f.league.name,
      status: f.fixture.status.short
    }));

    return {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(fixtures)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: e.message})
    };
  }
};

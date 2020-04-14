import type from "./type";
import axios from "axios";

const get = url => axios.get(url || "https://covid19.mathdro.id/api");

export const initialise = () => dispatch => {
  dispatch({ type: type.COVID19_INITIALISE_INFLIGHT });
  get()
    .then(({ data: meta }) => {
      get(meta.countries).then(({ data: { countries } }) => {
        get(meta.dailySummary).then(({ data: daily }) => {
          dispatch({
            type: type.COVID19_INITIALISE_SUCCESS,
            payload: {
              meta,
              covid19GlobalStats: [
                {
                  label: "infected",
                  value: meta.confirmed.value,
                  dailyIncrease:
                    daily.slice(-1)[0].confirmed.total -
                    daily.slice(-2)[0].confirmed.total
                },
                {
                  label: "recovered",
                  value: meta.recovered.value
                },
                {
                  label: "deaths",
                  value: meta.deaths.value,
                  dailyIncrease:
                    daily.slice(-1)[0].deaths.total -
                    daily.slice(-2)[0].deaths.total
                }
              ],
              countries: countries.map(country => country.name),
              country: "Global",
              covid19CountryStats: null,
              appInitialised: true,
              lastUpdated: daily.slice(-1)[0].reportDate
            }
          });
        });
      });
    })
    .catch(() => dispatch({ type: type.COVID19_INITIALISE_ERROR }));
};

const acGetIncrease = (country, { dailySummary }, lastUpdate) =>
  new Promise(async (resolve, reject) => {
    const date = new Date(Date.parse(lastUpdate));
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    const r1 = await get(`${dailySummary}/${m + 1}-${d - 1}-${y}`);
    const r2 = await get(`${dailySummary}/${m + 1}-${d - 2}-${y}`);
    if (r1 && r2) {
      const reducer = arr =>
        arr.reduce(
          (acc, { countryRegion, confirmed, deaths, recovered }) => {
            if (countryRegion.toLowerCase() === country.toLowerCase()) {
              return acc
                ? {
                    confirmed: Math.abs(
                      Number(acc.confirmed) + Number(confirmed)
                    ),
                    deaths: Math.abs(Number(acc.deaths) + Number(deaths)),
                    recovered: Math.abs(
                      Number(acc.recovered) + Number(recovered)
                    )
                  }
                : {
                    confirmed,
                    deaths,
                    recovered
                  };
            } else {
              return acc;
            }
          },
          {
            confirmed: 0,
            deaths: 0,
            recovered: 0
          }
        );

      const x1 = reducer(r1.data || {});
      const x2 = reducer(r2.data || {});

      resolve({
        confirmed: Math.abs((x1.confirmed || 0) - (x2.confirmed || 0)),
        deaths: Math.abs((x1.deaths || 0) - (x2.deaths || 0)),
        recovered: Math.abs((x1.recovered || 0) - (x2.recovered || 0))
      });
    } else
      resolve({
        confirmed: 0,
        deaths: 0,
        recovered: 0
      });
  });

export const acCovid19ByCountry = country => (dispatch, getState) => {
  if (country === "") dispatch(initialise());
  else {
    dispatch({ type: type.COVID19_BY_COUNTRIES_INFLIGHT });
    get(country ? `${getState().app.meta.countries}/${country}` : "")
      .then(({ data }) => {
        acGetIncrease(country, getState().app.meta, data.lastUpdate).then(
          ({ confirmed, recovered, deaths }) => {
            dispatch({
              type: type.COVID19_BY_COUNTRIES_SUCCESS,
              payload: {
                lastUpdated: data.lastUpdate,
                country,
                covid19CountryStats: [
                  {
                    label: "infected",
                    value: data.confirmed.value,
                    color: "rgba(0,0, 255, 0.5)",
                    dailyIncrease: confirmed || null
                  },
                  {
                    label: "recovered",
                    value: data.recovered.value,
                    color: "rgba(0,255, 0, 0.5)",
                    dailyIncrease: recovered || null
                  },
                  {
                    label: "deaths",
                    value: data.deaths.value,
                    color: "rgba(255,0, 0, 0.5)",
                    dailyIncrease: deaths || null
                  }
                ]
              }
            });
          }
        );
      })
      .catch(() => dispatch({ type: type.COVID19_BY_COUNTRIES_ERROR }));
  }
};

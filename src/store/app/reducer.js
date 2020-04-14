import t from "./type";

const reducer = (state = {}, { payload, type }) => {
  switch (type) {
    case t.COVID19_INITIALISE_INFLIGHT:
    case t.COVID19_BY_COUNTRIES_INFLIGHT:
      return Object.assign({}, state, { inFlight: true, isError: false });
    case t.COVID19_INITIALISE_SUCCESS:
    case t.COVID19_BY_COUNTRIES_SUCCESS:
      return Object.assign(
        {},
        state,
        { ...payload },
        { inFlight: false, isError: false }
      );
    case t.COVID19_INITIALISE_ERROR:
    case t.COVID19_BY_COUNTRIES_ERROR:
      return Object.assign(
        {},
        { isError: true },
        { inFlight: false, appInitialised: true }
      );
    default:
      return Object.assign({}, state, { inFlight: false });
  }
};

export default reducer;

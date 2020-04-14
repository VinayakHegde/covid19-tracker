import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { initialise, acCovid19ByCountry } from "src/store/app/dispatch";
import coronaImage from "src/images/logo.png";
import OptionSelector from "src/Components/OptionSelector/OptionSelector";
import Cards from "src/Components/Cards/Cards";
import "src/Components/App/App.scss";
import Loader from "src/Components/Loader/Loader";

const App = ({
  inFlight,
  isError,
  lastUpdated,
  appInitialised,
  countries,
  country,
  covid19GlobalStats,
  covid19CountryStats,
  initialise,
  acCovid19ByCountry
}) => {
  React.useEffect(() => {
    if (!appInitialised) {
      initialise();
    }
  }, [appInitialised, initialise]);
  return (
    <>
      <header className="App__header">
        <img
          className="App__content App__header__image"
          src={coronaImage}
          alt="COVID-19"
        />
      </header>
      <main className="App__main">
        {isError && (
          <div className="App__content App__main__error" onClick={initialise}>
            Something went wrong, click to refresh!{" "}
          </div>
        )}
        {!isError && (
          <div
            className={`${!inFlight ? "App__main__content " : ""}App__content`}
          >
            {inFlight && <Loader />}
            {!inFlight && countries && (
              <OptionSelector
                {...{
                  handleCountryChange: acCovid19ByCountry,
                  list: countries,
                  label: lastUpdated,
                  defaultValue: country || ""
                }}
              />
            )}
            {!inFlight && (covid19CountryStats || covid19GlobalStats) && (
              <Cards items={covid19CountryStats || covid19GlobalStats} />
            )}
          </div>
        )}
      </main>
      <footer className="App__footer">
        &copy; Viva Technology Consultancy Ltd. {new Date().getFullYear()}
      </footer>
    </>
  );
};

App.propType = {
  inFlight: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string),
  country: PropTypes.string,
  covid19CountryStats: PropTypes.any,
  covid19GlobalStats: PropTypes.any,
  acCovid19Daily: PropTypes.func.isRequired,
  acCovid19Countries: PropTypes.func.isRequired,
  acCovid19ByCountry: PropTypes.func.isRequired,
  appInitialised: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({ ...state.app });
export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      initialise,
      acCovid19ByCountry
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);

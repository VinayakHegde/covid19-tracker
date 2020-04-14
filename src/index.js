import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "src/Components/App/App";
import store from "src/store/store";

import "./index.scss";

ReactDOM.render(
  <Provider {...{ store }}>
    <App />
  </Provider>,
  document.getElementById("root")
);

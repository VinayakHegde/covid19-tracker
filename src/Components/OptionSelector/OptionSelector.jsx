import React from "react";
import { NativeSelect } from "@material-ui/core";

const OptionSelector = ({ handleCountryChange, list, label, defaultValue }) => {
  return (
    <>
      <NativeSelect
        defaultValue={defaultValue}
        onChange={e => {
          handleCountryChange(e.target.value);
        }}
      >
        <option value="">Global</option>
        {list.map((country, i) => (
          <option key={i} value={country}>
            {country}
          </option>
        ))}
      </NativeSelect>
      <div style={{ marginTop: "10px" }}>
        Last updated: {new Date(Date.parse(label)).toLocaleDateString()}
      </div>
    </>
  );
};

export default OptionSelector;

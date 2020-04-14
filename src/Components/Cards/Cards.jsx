import React from "react";
import CountUP from "react-countup";
import cx from "classnames";
import styles from "./Cards.module.css";

const Cards = ({ items }) => {
  const getGridProps = (label, key) => {
    if (!label) return false;

    let cssMod = false;
    if (label.toLowerCase() === "infected") {
      cssMod = styles.infected;
    }
    if (label.toLowerCase() === "recovered") {
      cssMod = styles.recovered;
    }
    if (label.toLowerCase() === "deaths") {
      cssMod = styles.deaths;
    }

    return {
      key,
      className: cx(styles.card, cssMod)
    };
  };
  const countUpProps = (end, prefix, suffix = "") => ({
    start: 0,
    duration: 2.5,
    separator: ",",
    className: styles.value,
    end,
    prefix,
    suffix
  });
  return (
    <div className={styles.container}>
      {items.map(({ label, value, dailyIncrease }, ind) => (
        <div {...getGridProps(label, ind)}>
          <div className={styles.label}>{label}</div>
          <CountUP {...countUpProps(value, "Total: ")} />
          {dailyIncrease && (
            <div>
              <CountUP {...countUpProps(dailyIncrease, "New: (+", ")")} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards;

import React from "react";
import styles from "./Home.module.css";

import AppLoader from "../utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { getDashboardData } from "../../actions/auth/action";
import { withRouter } from "react-router-dom";
import rightCardImg from "../../assets/img/rightCardImg.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Home = (props) => {
  React.useEffect(() => {
    if (!props.dashBoard) {
      props.getDashboardData();
    }
  }, []);

  const Card = (type, count) => {
    return (
      <div className={styles.card}>
        <h3>Total</h3>
        <h2>{type}</h2>
        <h1>{count}</h1>
      </div>
    );
  };
  const RightCard = (data) => {
    return (
      <div className={styles.rightCard}>
        <div className={styles.leftCardSection}>
          <img
            src={
              data &&
              data?.data?.home &&
              data.data?.home?.images &&
              data.data?.home?.images[0]
            }
            alt="...loading"
          />
        </div>
        <div className={styles.rightCardSection}>
          <h4>OwnedBy</h4>
          <h5>
            {data &&
              data?.data?.home &&
              data?.data?.home?.userProfile &&
              data?.data?.home?.userProfile?.firstName}
          </h5>
          <p>
            <LocationOnIcon />
            {data &&
              data?.data?.home &&
              data?.data?.home?.userProfile &&
              data?.data?.home?.userProfile?.location}
          </p>
          <p style={{ color: "#606060" }}>
            ₹ {data && data?.data?.home && data?.data?.home?.rent}
            /month
          </p>
          <p style={{ color: "#606060" }}>
            Deposit of ₹{data && data?.data?.home && data.data?.home?.deposit}
          </p>
        </div>
      </div>
    );
  };
  let arr = [
    {
      name: "users",
      count: props.dashBoard.userCount,
    },
    {
      name: "registered users",
      count: props?.dashBoard?.userCount,
    },
    {
      name: "guest users",
      count: props?.dashBoard?.userCount,
    },
    {
      name: "property upload",
      count: props?.dashBoard?.propertyCount,
    },
    {
      name: "bookings",
      count: 0,
    },
    {
      name: "buddy ups",
      count: 0,
    },
    {
      name: "move-ins",
      count: 0,
    },
  ];
  return (
    <div className={styles.container}>
      {!props.dashBoard && <AppLoader />}
      {props.dashBoard && (
        <>
          <div className={styles.upperSection}>
            <h2>Action Analysis</h2>
            <div className={styles.flex}>
              {arr.map((val, index) => {
                return <div>{Card(val.name, val.count)}</div>;
              })}
            </div>
          </div>
          <div className={styles.belowSection}>
            <div className={styles.belowLeft}>
              <h2>Property Overview</h2>
              <div className={styles.belowLeftContent}></div>
            </div>
            <div className={styles.belowRight}>
              <h2>Most Liked Property</h2>
              <RightCard data={props.dashBoard.mostFavorite} />
              <h2>Least Liked Property</h2>
              <RightCard data={props.dashBoard.leastFavorite} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashBoard: state.auth.dashBoard,
});
export default withRouter(connect(mapStateToProps, { getDashboardData })(Home));

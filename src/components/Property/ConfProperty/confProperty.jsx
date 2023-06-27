import React from "react";
import styles from "../Property.module.css";
import { TextField, Switch } from "@mui/material";
import axios from "axios";

const ConfProperty = (props) => {
  const [formData, setFormData] = React.useState({
    phoneNumber: "",
    email: "",
    userName: "",
    status: true,
  });
  const [error, setError] = React.useState(false);
  const addUser = () => {
    let url = props.editUser
      ? `/customer/updateCustomer`
      : `/customer/addCustomer`;
    axios({
      method: props.editUser ? "put" : "post",
      url: url,
      data: {
        ...formData,
      },
    })
      .then((res) => {
        props.setState("VIEW_PROPERTY");
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };
  React.useEffect(() => {
    if (props.editUser) {
      setFormData({ ...formData, ...props.editUser });
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <span
            onClick={() => {
              props.setState("VIEW_PROPERTY");
            }}
          >
            Customer Management
          </span>{" "}
          {">"} {props.editUser ? "Edit Property" : "New Property"}
        </div>

        <div className={styles.rightHeader}>
          <button onClick={() => alert("UNDER DEVELOPMENT")}>Save</button>
          <button
            style={{
              background: "transparent",
              color: "black",
              border: "black solid 1px",
            }}
            onClick={() => props.setState("VIEW_PROPERTY")}
          >
            Delete
          </button>
        </div>
      </div>
      <div className={styles.contentCustomer}>
        <div style={{ width: "40%" }}>
          {error && (
            <span
              style={{
                color: "red",
                fontSize: "0.8rem",
              }}
            >
              {error}
            </span>
          )}
          <TextField
            variant="standard"
            placeholder="Property Name"
            fullWidth
            className={styles.textField}
            value={formData.userName}
            onChange={(e) => {
              setFormData({ ...formData, userName: e.target.value });
            }}
          />

          <TextField
            type="number"
            variant="standard"
            placeholder="Owned By"
            fullWidth
            className={styles.textField}
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
            }}
          />
          <TextField
            type="date"
            variant="standard"
            placeholder="Email Id"
            fullWidth
            className={styles.textField}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <TextField
            type="location"
            variant="standard"
            placeholder="location"
            fullWidth
            className={styles.textField}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <div className={styles.toggle}>
            <h4>Status</h4>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfProperty;

import React from "react";
import styles from "../Customer.module.css";
import { TextField, Switch, InputAdornment } from "@mui/material";
import axios from "axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const CustomerAdd = (props) => {
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
        props.setState("GET_CUSTOMER");
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
              props.setState("GET_CUSTOMER");
            }}
          >
            User Management
          </span>{" "}
          {">"} {props.editUser ? "Edit User" : "Add User"}
        </div>

        <div className={styles.rightHeader}>
          <button onClick={() => addUser()}>Save</button>
          <button
            style={{
              background: "transparent",
              color: "black",
              border: "black solid 1px",
            }}
            onClick={() => props.setState("GET_CUSTOMER")}
          >
            Delete
          </button>
        </div>
      </div>
      <div className={styles.contentCustomer}>
        <div className={styles.leftCustomer}>
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
            placeholder="First name"
            fullWidth
            inputProps={{
              sx: {
                "&::placeholder": {
                  color: "black",
                  opacity: 1,
                  fontSize: "0.9rem",
                  fontFamily: "var(--poppins-font)",
                },
              },
            }}
            className={styles.textField}
            value={formData.userName}
            onChange={(e) => {
              setFormData({ ...formData, userName: e.target.value });
            }}
          />
          <TextField
            variant="standard"
            placeholder="Email Id"
            fullWidth
            inputProps={{
              sx: {
                "&::placeholder": {
                  color: "black",
                  opacity: 1,
                  fontSize: "0.9rem",
                  fontFamily: "var(--poppins-font)",
                },
              },
            }}
            className={styles.textField}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />

          {/* <TextField
            type="number"
            variant="standard"
            placeholder="Contact"
            fullWidth
            inputProps={{
              sx: {
                "&::placeholder": {
                  color: "black",
                  opacity: 1,
                  fontSize: "0.9rem",
                  fontFamily: "var(--poppins-font)",
                },
              },
            }}
            className={styles.textField}
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
            }}
          /> */}
          <TextField
            variant="standard"
            placeholder="Location"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LocationOnIcon
                    color="#000000"
                    fontSize="0.9rem"
                    style={{
                      color: "black",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            fullWidth
            inputProps={{
              sx: {
                "&::placeholder": {
                  color: "black",
                  opacity: 1,
                  fontSize: "0.9rem",
                  fontFamily: "var(--poppins-font)",
                },
              },
            }}
            className={styles.textField}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />

          <div className={styles.toggle}>
            <h4>Status</h4>
            <Switch
              sx={{
                "&.MuiSwitch-root .MuiSwitch-track": {
                  backgroundColor: "white !important",
                  border: "solid 1px black",
                },
                "&.MuiSwitch-root .Mui-checked": {
                  color: "#F8CD46",
                  width: "40px",
                },
              }}
              label={formData.status ? "Active" : "InActive"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAdd;

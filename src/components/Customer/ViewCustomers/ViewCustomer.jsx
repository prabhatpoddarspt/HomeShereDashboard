import React from "react";
import styles from "../Customer.module.css";
import {
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AppLoader from "../../utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAllCustomers } from "../../../actions/customer/action";

import axios from "axios";
import editIconSvg from "../../../assets/svg/editIcon.svg";
import { showAlert } from "../../../actions/auth/action";
const Customer = (props) => {
  const [page, setPage] = React.useState(1);
  const [checkList, setCheckList] = React.useState([]);
  const [searchVal, setSearchVal] = React.useState("");
  const [deleteId, setDeleteId] = React.useState();

  const downloadCsv = () => {
    axios({
      method: "get",
      url: `/utils/downloadMatesCsv`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "user.csv"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    props.getAllCustomers(10, page, "");
  }, []);
  const handleChange = (event, value) => {
    setPage(value);
    props.getAllCustomers(10, value, searchVal);
  };
  const handleSearch = (search) => {
    setSearchVal(search);
    props.getAllCustomers(10, 1, search ?? searchVal);
  };

  const updateAllCheckList = () => {
    props.customer &&
      props.customer.map((val) => {
        if (!checkList.includes(val._id)) {
          setCheckList((prevCheckList) => [...prevCheckList, val._id]);
        } else {
          setCheckList([]);
        }
      });
  };
  // const updateAllCheckList = () => {
  //   props.customer &&
  //     props.customer.map((val) => {
  //       if (!checkList.includes(val._id)) {
  //         setCheckList([...checkList, val._id]);
  //       } else {
  //         setCheckList([]);
  //       }
  //     });
  // };

  const updateSingleCheckList = (value) => {
    if (checkList.includes(value)) {
      // Filter out the value if it's already present
      const filteredCheckList = checkList.filter((item) => item !== value);
      setCheckList(filteredCheckList);
    } else {
      // Add the value to the checkList
      setCheckList([...checkList, value]);
    }
  };

  const updateUser = (_id, data) => {
    axios({
      method: "put",
      url: `/customer/updateCustomer`,
      data: {
        _id,
        ...data,
      },
    })
      .then((res) => {
        props.getAllCustomers(10, page, "");
        props.showAlert(`${data.deleted ? "Deleted" : "Updated"} Successfully`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let isLoading = !props.customer;
  let showData = !isLoading;
  let rowData = [];

  !isLoading &&
    props.customer.forEach((user) => {
      rowData.push({
        ...user,
        select: (
          <Checkbox
            checked={checkList.includes(user._id)}
            onChange={() => updateSingleCheckList(user._id)}
          />
        ),
        email: user.email,
        lastName: user?.userProfile?.lastName,
        profileCreated: moment(user?.userProfile?.createdAt).format(
          "DD MMM YYYY, h:mm A"
        ),
        accountCreated: moment(user?.createdAt).format(
          "DD MMM YYYY, h:mm A"
        ),
        location: user?.userProfile?.location,
        name: (
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => props.handleClick(user, "USER-INFO")}
          >
            {user?.userProfile?.firstName}
          </span>
        ),
        type: !user.isAdminRegistered ? "Registered" : "Not-Registered",
        action:
          deleteId === user._id ? (
            "...Deleting"
          ) : (
            <DeleteSweepIcon
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDeleteId(user._id);
                updateUser(user._id, { deleted: true });
              }}
            />
          ),

        // </div>
        status: (
          <FormControlLabel
            control={
              <Switch
                value={user.status}
                onChange={() => {
                  updateUser(user._id, { status: !user.status });
                }}
                checked={user.status}
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
              />
            }
            label={user.status ? "Active" : "InActive"}
          />
        ),
      });
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>User Management</div>

        <div className={styles.rightHeader}>
          <TextField
            fullWidth
            sx={{ background: "white" }}
            inputProps={{
              style: {
                height: "45px",
                padding: 0,
              },
              sx: {
                "&::placeholder": {
                  fontSize: "0.9rem",
                  color: "#B7B7B7",
                  fontFamily: "var(--poppins-font)",
                },
              },
            }}
            InputProps={{
              style: {
                color: "#B7B7B7",
                border: "solid 1px #707070",
                borderRadius: "10px",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#B7B7B7" }} />
                </InputAdornment>
              ),
            }}
            placeholder="Search Via Name,ID"
            className={styles.search}
            value={searchVal}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            style={{
              background: "white",
              color: "#323232",
              border: "solid 1px #707070",
              borderRadius: "10px",
            }}
            onClick={() => downloadCsv()}
          >
            Export
          </button>
          <button onClick={() => props.setState("ADD-CUSTOMER")}>
            Add New
          </button>
        </div>
      </div>

      {isLoading && <AppLoader />}

      {showData && (
        <div className="table">
          <DataTable
            noHeader={true}
            fixedHeader={true}
            pagination={false}
            fixedHeaderScrollHeight={"calc(100vh - 250px)"}
            columns={[
              {
                name: <Checkbox onChange={() => updateAllCheckList()} />,
                selector: "select",
                sortable: false,
                width: "70px",
              },
              {
                name: "USER ID",
                selector: "_id",
                width: "150px",
              },
              {
                name: "FIRST NAME",
                selector: "name",
                minWidth: "100px",
                width: "130px",
              },
              {
                name: "LAST NAME",
                selector: "lastName",
                sortable: true,
                minWidth: "100px",
                width: "130px",
              },
              {
                name: "EMAIL ID",
                selector: "email",
                sortable: true,

                minWidth: "270px",
              },

              { name: "LOCATION", selector: "location" },
              { name: "ACCOUNT CREATED AT", selector: "accountCreated",minWidth:"190px" },
              { name: "PROFILE CREATED AT", selector: "profileCreated",minWidth:"190px" },

              { name: "ACTION", selector: "action" },
              { name: "STATUS", selector: "status", minWidth: "150px" },
            ]}
            data={rowData}
          />
        </div>
      )}
      <Stack spacing={2} className="pagination">
        <Pagination
          count={props.customerCount}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
};
const mapStateToProps = (state) => ({
  customer: state.customer.customer,
  customerCount: state.customer.customerCount,
});
export default withRouter(
  connect(mapStateToProps, { getAllCustomers, showAlert })(Customer)
);

import React from "react";
import styles from "../Property.module.css";
import {
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AppLoader from "../../utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { getAllProperty } from "../../../actions/property/action";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import editIconSvg from "../../../assets/svg/editIcon.svg";
const ViewProperty = (props) => {
  const [page, setPage] = React.useState(1);
  const [checkList, setCheckList] = React.useState([]);
  const [searchVal, setSearchVal] = React.useState("");
  const [filter, setFilter] = React.useState(false);

  const downloadCsv = () => {
    axios({
      method: "get",
      url: `/home/downloadHomeCsv`,
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
        link.setAttribute("download", "property.csv"); //@INFO : CAN GIVE OTHER EXT TOO
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    props.getAllProperty(10, page, "");
  }, []);
  const handleChange = (event, value) => {
    setPage(value);
    props.getAllProperty(10, value, searchVal);
  };
  const handleSearch = (search) => {
    setSearchVal(search);
    props.getAllProperty(10, 1, search ?? searchVal);
  };
  const updateAllCheckList = () => {
    props.properties &&
      props.properties.map((val) => {
        if (!checkList.includes(val._id)) {
          setCheckList([...checkList, val._id]);
        } else {
          setCheckList([]);
        }
      });
  };

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

  const deleteUser = (_id) => {
    axios({
      method: "put",
      url: `/customer/updateCustomer`,
      data: {
        _id,
        deleted: true,
      },
    })
      .then((res) => {
        props.getAllProperty(10, page, "");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let isLoading = !props.properties;
  let showData = !isLoading;
  let rowData = [];

  !isLoading &&
    props.properties.forEach((user) => {
      rowData.push({
        ...user,
        select: (
          <Checkbox
            checked={checkList.includes(user._id)}
            onChange={() => updateSingleCheckList(user._id)}
          />
        ),
        owner: user.userProfile.firstName,
        location: user.userProfile.location,
        createdAt: moment(user.createdAt).format("DD-MM-YYYY"),
        name: (
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => props.handleClick(user, "USER-INFO")}
          >
            {user.userProfile.firstName}'s home
          </span>
        ),
        type: !user.isAdminRegistered ? "Registered" : "Not-Registered",
        action: (
          <div className={styles.actionButton}>
            <img
              src={editIconSvg}
              alt="EDIT"
              style={{ marginRight: "0.5rem", cursor: "pointer" }}
            />
            <DeleteSweepIcon onClick={() => deleteUser(user._id)} />
          </div>
        ),
        status: (
          <FormControlLabel
            control={
              <Switch
                checked={true}
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
            label={user.userId.status ? "Active" : "InActive"}
          />
        ),
      });
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Property Management</div>

        <div className={styles.rightHeader}>
          <TextField
            fullWidth
            sx={{ background: "white" }}
            inputProps={{
              style: {
                height: "45px",
                padding: 0,
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
              background: "#fdfbf7",
              display: "flex",
              height: "45px",
              color: "#B7B7B7",
              border: "solid 1px #707070",
              borderRadius: "10px",
            }}
          >
            <FilterAltOutlinedIcon style={{ fontSize: "1.1rem" }} />
            Filter
          </button>
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
                maxWidth: "50px",
              },
              {
                name: "PROPERTY ID",
                selector: "_id",
              },
              {
                name: "NAME",
                selector: "name",
              },
              {
                name: "OWNER NAME",
                selector: "owner",
                sortable: true,
              },

              { name: "LOCATION", selector: "location" },
              { name: "DATE REGISTERED", selector: "createdAt" },
              { name: "ACTION", selector: "action" },
              { name: "STATUS", selector: "status" },
            ]}
            data={rowData}
          />
        </div>
      )}
      <Stack spacing={2} className="pagination">
        <Pagination
          count={props.propertyCount}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
};
const mapStateToProps = (state) => ({
  properties: state.property.property,
  propertyCount: state.property.propertyCount,
});
export default withRouter(
  connect(mapStateToProps, { getAllProperty })(ViewProperty)
);

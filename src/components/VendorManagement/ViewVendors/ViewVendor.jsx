import React from "react";
import styles from "../Vendor.module.css";
import {
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import Visibility from "@mui/icons-material/Visibility";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AppLoader from "../../utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { getAllMoveIns } from "../../../actions/moveIn/action";
import axios from "axios";
const ViewVendor = (props) => {
  const [page, setPage] = React.useState(1);
  const [searchVal, setSearchVal] = React.useState("");

  React.useEffect(() => {
    if (!props.moveIn) {
      props.getAllMoveIns(page, 10, searchVal);
    }
  }, []);
  const downloadCsv = () => {
    axios({
      method: "get",
      url: `/moveIn/downloadMoveinCsvv`,
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
        link.setAttribute("download", "moveIn.csv"); //@INFO : CAN GIVE OTHER EXT TOO
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearch = (search) => {
    setSearchVal(search);
    props.getAllMoveIns(page, 10, search ?? searchVal);
  };
  // React.useEffect(() => {
  //   props.getAllCustomers(10, page, "");
  // }, []);
  // const handleChange = (event, value) => {
  //   setPage(value);
  //   props.getAllCustomers(10, value, searchVal);
  // };
  // const handleSearch = (search) => {
  //   setSearchVal(search);
  //   props.getAllCustomers(10, page, search ?? searchVal);
  // };

  let isLoading = !props.moveIn;
  let showData = !isLoading;
  let rowData = [];

  !isLoading &&
    props.moveIn &&
    props.moveIn.forEach((data) => {
      rowData.push({
        _id: data._id,
        propertyName: data?.ownerIdProfile?.firstName + "'s home",
        ownerName: data?.ownerIdProfile?.firstName,
        createdAt: moment(data.createdAt).format("DD MMM YYYY, h:mm A"),
        location: data?.ownerIdProfile?.location,
        initiatedBy: data?.intiatedByProfile?.firstName,

        action: (
          <div
            className={styles.actionButton}
            onClick={() => props.handleClick(data)}
          >
            <Visibility />
          </div>
        ),
        status: <FormControlLabel control={<Switch />} />,
      });
    });

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Move ins</div>

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
              background: "#fdfbf7",
              height: "45px",
              color: "#323232",
              border: "solid 1px #707070",
              borderRadius: "10px",
            }}
            onClick={() => downloadCsv()}
          >
            Export
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
            fixedHeaderScrollHeight={"calc(100vh - 220px)"}
            columns={[
              { name: "MEET UP ID", selector: "_id", sortable: true },
              {
                name: "PROPERTY NAME",
                selector: "propertyName",
                sortable: true,
              },
              { name: "OWNER NAME", selector: "ownerName", minWidth: "100px" },
              { name: "TIMESTAMP", selector: "createdAt", minWidth: "200px" },
              { name: "LOCATION", selector: "location" },
              { name: "INTIATEDBY", selector: "initiatedBy" },
              { name: "STATUS", selector: "status" },
            ]}
            data={rowData}
          />
        </div>
      )}
      <Stack spacing={2} className="pagination">
        <Pagination
          count={props.count}
          page={page}
          // onChange={handleChange}
        />
      </Stack>
    </div>
  );
};
const mapStateToProps = (state) => ({
  moveIn: state.moveIn.moveIn,
  count: state.moveIn.moveInCount,
});
export default withRouter(
  connect(mapStateToProps, { getAllMoveIns })(ViewVendor)
);

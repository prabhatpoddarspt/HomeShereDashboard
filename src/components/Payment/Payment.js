import React from "react";
import styles from "./Payment.module.css";
import { TextField, InputAdornment, Checkbox } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AppLoader from "../utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAllTransaction } from "../../actions/payment/action";
import moment from "moment";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import axios from "axios";
const Payment = (props) => {
  const [page, setPage] = React.useState(1);
  const [checkList, setCheckList] = React.useState([]);
  const [searchVal, setSearchVal] = React.useState("");

  React.useEffect(() => {
    props.getAllTransaction(1, 10, "");
  }, []);
  console.log(props.pageCount);
  const handleChange = (event, value) => {
    setPage(value);
    props.getAllTransaction(value, 10, searchVal);
  };
  const handleSearch = (search) => {
    setSearchVal(search);
    props.getAllTransaction(1, 10, search);
  };

  const downloadCsv = () => {
    axios({
      method: "post",
      url: `/paymnet/downloadTransactionCsv`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
      data: {
        id: checkList.length > 0 ? checkList : false,
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

  const updateAllCheckList = () => {
    props.payment &&
      props.payment.map((val) => {
        if (!checkList.includes(val._id)) {
          setCheckList((prevCheckList) => [...prevCheckList, val._id]);
        } else {
          setCheckList([]);
        }
      });
  };
  const updateSingleCheckList = (value) => {
    if (checkList.includes(value)) {
      const filteredCheckList = checkList.filter((item) => item !== value);
      setCheckList(filteredCheckList);
    } else {
      setCheckList([...checkList, value]);
    }
  };
  let isLoading = false;
  let showData = !isLoading;
  let rowData = [];

  !isLoading &&
    props.payment &&
    props.payment.forEach((item) => {
      rowData.push({
        ...item,
        select: (
          <Checkbox
            checked={checkList.includes(item._id)}
            onChange={() => updateSingleCheckList(item._id)}
          />
        ),
        price: item.currency ?? "R" + " " + item.amount,
        date: moment(item.createdAt).format("DD MMM YYYY, h:mm A"),
        Status: <div className={styles.status}>{item.status}</div>,
      });
    });

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.header}>
          <div className={styles.leftHeader}>Payment & Transaction</div>

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
              placeholder="Search"
              className={styles.search}
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
              style={{
                background: "white",
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
              onClick={() => downloadCsv()}
              style={{
                background: "white",
                color: "#323232",
                border: "solid 1px #707070",
                borderRadius: "10px",
                height: "45px",
              }}
            >
              Exports
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
                {
                  name: <Checkbox onChange={() => updateAllCheckList()} />,
                  selector: "select",
                  sortable: false,
                  maxWidth: "50px",
                },
                { name: "Transaction id", selector: "nonce", sortable: true },
                { name: "Type", selector: "type", sortable: true },
                { name: "Price", selector: "price" },
                { name: "TimeStamp", selector: "date" },
                { name: "Status", selector: "Status" },
              ]}
              data={rowData}
            />
          </div>
        )}
        <Stack spacing={2} className="pagination">
          <Pagination
            count={props.pageCount ?? 1}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  payment: state.payment.transactions,
  pageCount: state.payment.transactionInCount,
});
export default withRouter(
  connect(mapStateToProps, { getAllTransaction })(Payment)
);

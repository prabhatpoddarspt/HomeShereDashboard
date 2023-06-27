import * as actionTypes from "./actionTypes";
import axios from "axios";

export const getAllProperty = (limit, page, search) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_PROPERTY,
    payload: false,
  });

  axios({
    method: "get",
    basic:true,
    url: `/home/getAllHomes?limit=${limit}&page=${page}&search=${search}`,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_PROPERTY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_PROPERTY,
        payload: [],
      });

      dispatch({
        type: "SHOW_ALERT",
        payload: "Something went Wrong! Try Again",
      });
    });
};

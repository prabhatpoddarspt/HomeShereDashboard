import * as actionTypes from "./actionTypes";
import axios from "axios";

export const getAllMoveIns = (page, limit, search) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_MOVE_INS,
    payload: false,
  });

  axios({
    method: "get",
    url: `/moveIn/getAllMoveIns?page=${page}&limit=${limit}&search=${search}`,
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_MOVE_INS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_MOVE_INS,
        payload: [],
      });

      dispatch({
        type: "SHOW_ALERT",
        payload: "Something went Wrong! Try Again",
      });
    });
};

import { FC } from "react";
import { StatusLogType } from "..";
import moment from "moment";
import { Typography } from "antd";

interface PropsTypes {
  statusLogs?: StatusLogType[];
}

const IndividualStatusLogs: FC<PropsTypes> = (props) => {
  const { statusLogs } = props;
  return (
    <div>
      <Typography.Text style={{ color: "#8C8C8C", paddingTop: "1em" }}>
        Status Logs
      </Typography.Text>
      <div
        style={{
          height: "100px",
          overflow: "auto",
          paddingBottom: "2em",
        }}
      >
        {statusLogs?.map((v) => {
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
              }}
            >
              <div
                style={{
                  color:
                    v.status == "Active"
                      ? "green"
                      : v.status == "Break"
                      ? "orange"
                      : "red",
                }}
              >
                {v.status}{" "}
              </div>
              <div>{moment(v.time).format("DD/MM/YYYY HH:mm:ss")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndividualStatusLogs;
